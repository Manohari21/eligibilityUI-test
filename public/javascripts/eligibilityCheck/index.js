$(document).ready(function () {
    $('#eligibility-check-info').modal('hide');
    document.querySelector("#eligibility-check-progress").classList.add("d-none");
    let modalContents = document.querySelector("#eligibility-modal-content");
    let errorArea = modalContents.querySelector("#error-msg");
    errorArea.classList.remove("d-none");
    errorArea.textContent = "";
    let successArea = modalContents.querySelector("#success-msg");
    successArea.classList.remove("d-none");
    successArea.textContent = "";
});
function onCancelClicked() {
    document.getElementById("eligibility-check-form").reset();
  } 

function addFieldValidationBorder(tag) {
    document.querySelector(tag).classList.add("border", "border-danger");
}

function removeFieldValidationBorder(tag) {
    document.querySelector(tag).classList.remove("border", "border-danger");
}

function onEligibilityBtnClicked() {
    let subscriberId = document.querySelector("#subscriber-id").value;
    let policyId = document.querySelector("#policy-id").value;
    let dependentId = document.querySelector("#dependent-id").value;
    let ids = ["#subscriber-id", "#dependent-id", "#policy-id"];
    console.log(subscriberId, policyId, dependentId);
    if (!subscriberId || !policyId || !dependentId) {
        // border border-danger
        if (!subscriberId) {
            addFieldValidationBorder("#subscriber-id");
        }
        if (!policyId) {
            addFieldValidationBorder("#policy-id");
        }
        if (!dependentId) {
            addFieldValidationBorder("#dependent-id");
        }
    } else {
        let data = {
            subscriberId: subscriberId,
            policyId: policyId,
            dependentId: dependentId
        };

        // Submit it to NodeJS (jQuery)
        $.post("/eligibility", data, function (result, status, jqXHR) {// success callback
            document.querySelector("#eligibility-check-progress").classList.remove("d-none");
            let modalContents = document.querySelector("#eligibility-modal-content");
            let errorCode = result.code;
            let value = result.message;
            let errorMessage = "Uh-Oh. Something went wrong. Please try again.";
            if (errorCode >= 300 || errorCode < 200) {
                // Some error happened
                let errorArea = modalContents.querySelector("#error-msg");
                errorArea.classList.remove("d-none");
                errorArea.textContent = errorMessage;
            } else {
                let successArea = modalContents.querySelector("#success-msg");
                successArea.classList.remove("d-none");
                successArea.textContent = value;
            }
            for (let id of ids) {
                removeFieldValidationBorder(id);
            }
            $('#eligibility-check-info').modal('show');
            document.querySelector("#eligibility-check-progress").classList.add("d-none");
        });
    }
}