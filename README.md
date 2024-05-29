# chat-app

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

## Overview

This is a basic chat application. The purpose to create this project to understand how to work websocket connection. This application simulated how a real chat application  work. After registration, you able to logging into the application. After that you can easily keep in touch with your friends, you should only know your friends name to create a private chat channel. You don't have to worry about losing your old messages, because all messages are saved in a database. If you want, you can add reactions (emoticons) to each message to help express yourself more easily.

## Table of Contents

- [Overview](#overview)
- [Build With](#build-with)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)


## Built With

![C#](https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=csharp&logoColor=white)
![ASP.NET](https://img.shields.io/badge/ASP.NET-5C2D91?style=for-the-badge&logo=.net&logoColor=white)
![MSSQL Server](https://img.shields.io/badge/Microsoft%20SQL%20Server-CC2927?style=for-the-badge&logo=microsoft%20sql%20server&logoColor=white)
![NPM](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![MaterialUI](https://img.shields.io/badge/Material%20UI-007FFF?style=for-the-badge&logo=mui&logoColor=white)


## Features

Registration:
- Auto progresbar.
- Several warning sign based on build in validation.
- Automatically check if the email and username are used.
- Submit button show only if all field are correct.
- Show and hide password function.

Log in:
+ Show and hide password function.
+ Built in brute force defence.
+ Email or username are also accepted for log in.

Chat (main page):
+ Real time chat modul.
+ Auto scroll function.
+ Emojies.
+ Loading old messages.
    

## Installation

Prerequisites:
- .NET 8.0 SDK
- Node.js (20.11 or later) and npm (10.2.4 or later)
- SQL Server

1. Clone the repository. (`git clone git@github.com:alma100/chat-app.git`)
   
Backend:

2. Navigate a "chat-HTTP-server": `cd chat-HTTP-server/chat-HTTP-server`
3. Configure the `appsettings.json`
   - Set your database connection string. Example: `"ConnectionStrings": {
  "DefaultConnectionString": "Server=localhost,1433;Database=Chat;User Id=sa;Password=yourStrong(!)Password;Encrypt=false;"}`
   - If you dont have any SQL server you have to do a new one.
   - Install docker: https://docs.docker.com/engine/install/
   - Run this image in terminal: `docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=yourStrong(!)Password" -p 1433:1433 -v <absolute path to the file>:/var/opt/mssql/data mcr.microsoft.com/mssql/server:2022-latest`
   - Important: If your os Windows, open docker desktop first, and run the command second.
   - Don't forget to change `<absolute path to the file>` this section to your file absolute path.
   - Set JWT variable: `"Jwt": {
    "Key": "Akljw56DWqDDA120978juKWPxhrz65u7uturtu556786767ujhgg",
    "Issuer": "https://localhost:5129/",
    "Audience": "https://localhost:5129/"
  },`
4. Add and run database migrations to create schemas:
   - Add migration: `dotnet ef migrations add InitialCreate`
   - Update database: `dotnet ef database update`
6. Run the application: `dotnet run`
7. Back to the root folder: `cd ../../`
8. Set the websocket server `appsettings.json`:
   - `cd chat-WebSockets-server\chat-WebSockets-server`
   - Set the same value to the connection string and JWT token.
   - Set the "MessageIndex" variable: `"MessageIndex": {
    "InitialIndex": "200"
      }` This variable set that how many old messages send to the client/chat/fetch. 
   - You dont need to create a migration step here again.
9. Run the application: `dotnet run`

Frontend:

10. Navigate to the frontend directory: `cd ../../frontend`
11. Install dependencies: `npm install`
12. Run the application: `npm run dev`


## Usage

First of all, you have to create a new account. If every input field is correct, submit button appear.

![reg-example](https://github.com/alma100/chat-app/assets/89401657/932c7b4b-78c7-4702-b627-48719efdd200)

If registration succes you will see a confirm message.

![reg-confirm](https://github.com/alma100/chat-app/assets/89401657/48fe66d3-cd45-40d4-a90f-41c104bf20e4)

After that you able to log into the application.

![log-in](https://github.com/alma100/chat-app/assets/89401657/86143005-90bd-4515-bb88-6061677c053c)






## Contact

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/aba-s%C3%A1muel-grin%C3%A1cz-25b69729b/)
[![GMAIL](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:grinacza@gmail.com)


