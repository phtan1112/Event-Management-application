# Event Management Application

   Event Management application using React Native technology and developing a cross-platform mobile application. In our project, we use the server that is written Java Spring Boot to create APIs for React Native to fetch and call APIs.
   

## SERVER SPRING
### Technology used: 
* Spring Boot, Spring Security, Spring Mail, Spring Data JPA, JWT with Bearer Token, Scheduled, Cloudinary,  MySQL and EC2.


### SERVICES
* Rate limiting with Bucket4j.
* Optimise response time of APIs using async ThreadPoolTaskExecutor of Executor on Mail Service and Upload image Service on Cloudinary.
* Verification Code where the user restore password and register new account.
* Handle Scheduled for server to auto change status, remove token from database when it is expired at 1 pm on sunday weekly, verification code is expired 60 seconds and remove verification code from database at 2 am on sunday weekly.
* EC2 of AWS for deploying the server with the url: `13.228.53.183`, Read the document of APIs below.


### How to run server Spring Boot with `Docker` on CLI. Before you start step by step below so make sure you have already installed Docker desktop and login successful with your Docker account.

1. **Run this command below on your terminal:**

   ```Powershell
   docker run -dp 8083:8083 --name springboot-docker-container tanphuocdt1/springboot-docker:v1.0.7
2. Watch logs of this container until you see the logs `Started ServerApplication in x.xxx seconds`.  
3. **Note:**
   You should put the port 8083 if you do not have any application that run in this port. If you have, so you need to change the different port.

### List of account in database:
* admin@gmail.com - admin123

* tanphuocdt1@gmail.com - 123456

* septan1112@gmail.com - 654321

### Link of Document API and Postman collection:
   Click [Drive](https://drive.google.com/drive/folders/1d3IZ_dYze40N48jQmNO2OpGwV256From?usp=sharing) to see the API description.  
## React Native
### Update soon
