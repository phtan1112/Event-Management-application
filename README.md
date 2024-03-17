# Event Management Application

Event Management application using React Native technology and developing a cross-platform mobile application. In our project, we use the server that is written Java Spring Boot to create APIs for React Native to fetch and call APIs.

## SERVER SPRING

### Technology used:

- Spring Boot, Spring Security, Spring Mail, Spring Data JPA, JWT with Bearer Token, Scheduled, Cloudinary, MySQL and EC2.

### SERVICES

- Rate limiting with Bucket4j.
- Optimise response time of APIs using async ThreadPoolTaskExecutor of Executor on Mail Service and Upload image Service on Cloudinary.
- Verification Code where the user restore password and register new account.
- Handle Scheduled for server to auto change status, remove token from database when it is expired at 1 pm on sunday weekly, verification code is expired 60 seconds and remove verification code from database at 2 am on sunday weekly.
- EC2 of AWS for deploying the server with the url: `13.228.53.183`, Read the document of APIs below.

### How to run server Spring Boot with `Docker` on CLI. Before you start step by step below so make sure you have already installed Docker desktop and login successful with your Docker account

1. **Run this command below on your terminal:**

   ```Powershell
   docker run -dp 8083:8083 --name springboot-docker-container tanphuocdt1/springboot-docker:v1.0.8
   ```

2. Watch logs of this container until you see the logs `Started ServerApplication in x.xxx seconds`.
3. **Note:**
   You should put the port 8083 if you do not have any application that run in this port. If you have, so you need to change the different port (for example: 8081, 8082, etc, on your demand)

### How to run server Spring Boot on computer
1. The server uses Java JDK 17 (corretto-17)
2. Clone project to your computer
3. If you have Intellij IDEA IDE of Jetbrain, opening server folder in this IDEA.
4. If not have IDEA, opening terminal and cd Server/, type 
   ```Powershell 
   ./mvnw spring-boot:run 
   ```


### Link of Document APIs and Postman collection:

Click [Drive](https://drive.google.com/drive/folders/1d3IZ_dYze40N48jQmNO2OpGwV256From?usp=sharing) to see the API description.

## React Native

### Android OS:

1. Clone the project: Clone the project repository to your computer using Git.
   - git clone <repository_url>
2. Navigate to Client Folder: After cloning the project, navigate to Client Folder in the terminal:
   - cd Client-Event
3. Install dependencies: Before running the project, make sure to install the necessary dependencies by running:
   - npm install
4. Start the development server: Run the following command to start the Expo development server:
   - npm start
5. Scan the QR code: After running the command, you'll see a QR code generated in the terminal. Use the Expo Go app on your Android device from the Google Play Store to scan this QR code.

6. Connect to the application: Once the QR code is scanned, Expo will bundle your React Native project and provide you with a live preview on your device. You should be able to see and interact with your application.

### iOS: Make sure you have already installed XCode and create a simulator of iOS




