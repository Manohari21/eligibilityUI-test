# Eligibility POC UI

This repo hosts the eligibility application POC UI, built using NodeJS, Vanilla JavaScript, and ExpressJS to serve web pages.
It uses docker containers for re-usable deployments and to streamline the develop, test, deploy, maintain lifecycle.

## Environment variables

|      Variable Name      |                   Variable Description                    |                                                  Example                                                   |
| :---------------------: | :-------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------: |
|          PORT           |                  NodeJS application port                  |                                             `export PORT=3000`                                             |
| ELIGIBILITY_SERVICE_URL |    Spring Eligibility Service URL (includes endpoint)     |                  `export ELIGIBILITY_SERVICE_URL=http://192.168.56.104:8080/getBenefits`                   |
|  MONGO_CONNECTION_URI   |             Mongo database connection string              | `export MONGO_CONNECTION_URI=mongodb://admin:admin@mongo-eligibility:27017/eligibilityDB?authSource=admin` |
|   POLICY_SERVICE_URL    |       Spring Policy Service URL (includes endpoint)       |                       `export POLICY_SERVICE_URL=http://localhost:8080/getPolicies`                        |
| ENROLLMENT_SERVICE_URL  |     Spring Enrollment Service URL (includes endpoint)     |                   `export ENROLLMENT_SERVICE_URL=http://localhost:8080/createEnrollment`                   |
|   POLICY_DETAILS_URL    | Spring Policy Details information URL (includes endpoint) |                     `export POLICY_DETAILS_URL=http://localhost:8080/getPolicyDetails`                     |

## Setup (Docker)

1. Ensure docker is running and note down the host and port information

2. Create a volume for MongoDB data or use an existing one

    a. `docker volume create eligibility-data`

3. Create a network to connect all the apps or use an existing one

    a. `docker network create eligibility-nw`

4. Launch a MongoDB container or use an existing one

    a. `docker container run --name mongo-eligibility --network eligibility-nw -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=admin -d --volume eligibility-data:/db/data mongo:3.4`

    b. Using 3.4 to maintain consistency with OpenShift

    c. If using an existing MongoDB container, ensure it is connected to a network

5. Launch the Java Spring container from [here](https://github.com/Manohari21/EnrollmentApp)

    a. Clone the linked repository

    b. Open the directory in a Terminal

    c. Run `docker image build -t eligibility-server .`

    d. Run `docker container run --name eligibility-server -e SPRING_PROFILES_ACTIVE=docker -e MONGO_CONNECTION_URI=mongodb://admin:admin@mongo-eligibility:27017/eligibilityDB?authSource=admin -d --network eligibility-nw -p 8080:8080 eligibility-server`

6. Launch the NodeJS container (this project)

    a. Open directory in a Terminal

    b. Run `docker image build -t eligibility-ui .`

    c. Run `docker container run --name eligibility-ui -e ELIGIBILITY_SERVICE_URL=http://eligibility-server:8080/getBenefits -e POLICY_SERVICE_URL=http://eligibility-server:8080/ -e ENROLLMENT_SERVICE_URL=http://eligibility-server:8080/ -d eligibility-ui`

7. Navigate to DockerHost:3000 in Chrome

    a. DockerHost is the host IP address of your docker machine

    b. Eg: If docker is running in Virtualbox then DockerHost is the IP address of the VirtualBox.

## Local setup

1. Run **steps 1 to 5** from the above heading

2. Open project folder in Terminal

3. Run `export ELIGIBILITY_SERVICE_URL=http://eligibility-server:8080/getBenefits`

4. Run `export POLICY_SERVICE_URL=http://eligibility-server:8080/`

5. Run `export ENROLLMENT_SERVICE_URL=http://eligibility-server:8080/`

6. Run `npm start`

7. Navigate to `localhost:3000` to view the application


CI test
1. Run **steps 1 to 5** from the above heading

2. Open project folder in Terminal

3. Run `export ELIGIBILITY_SERVICE_URL=http://eligibility-server:8080/getBenefits`

4. Run `export POLICY_SERVICE_URL=http://eligibility-server:8080/`

5. Run `export ENROLLMENT_SERVICE_URL=http://eligibility-server:8080/`

6. Run `npm start`

7. Navigate to `localhost:3000` to view the application
