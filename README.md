#TACO Finance Recipe

##Introduction 

This is a sample application recipe for Visual Studio Tools for Apache Cordova. It uses the Ionic Framework and Apache Cordova to create a **Financial Advisor** mobile application. 

## Application Overview

The application addresses many of the requirements for a financial advisor, providing the advisor with mobile access to his client list, plus account and investment details for each client. The application also provides research and alerting capabilities. The research area of the app enables users to lookup stock information, view pricing details plus relevant news for the particular company. Users can define alert thresholds for specific stocks and configure the app to receive push notifications whenever stock price exceeds or falls below specific (configurable) thresholds. You can learn more about the client-side application in the [client application readme file](FinanceAppIonic/readme.md).
 
On the back-end, the application makes use of several Microsoft cloud services to deliver capabilities in the mobile app:

+ [Azure Mobile App Service](https://azure.microsoft.com/en-us/services/app-service/mobile/) - Provides authentication services for the mobile application and data storage (through Azure Easy Tables). 
+ [Azure Functions](https://azure.microsoft.com/en-us/services/functions/) - Manages the alerting capabilities of the mobile app.
+ [Azure Notification Hub](https://azure.microsoft.com/en-us/services/notification-hubs/) - Manages delivery of alert notifications to the mobile app.
+ [Microsoft Code Push](https://microsoft.github.io/code-push/) - Delivers application code updates over the air (OTA).

The interactions between the different cloud services are highlighted in the following figure: 

![Application Components](images/figure-01.png)

The application currently uses a third-party stock lookup service from [Markit On Demand](http://dev.markitondemand.com/MODApis/) to provide stock and stock performance data for the application.

Alerts sent to the mobile application are delivered through push notification services provide by the mobile device platform vendor (Google, Apple and Microsoft).

The following figure highlights how the alerting capability of the application operates:

![Application Components](images/figure-02.png)

## Application Files & Folders

+ `FinanceAppRecipe.sln` - A Microsoft Visual Studio solution file for the project.
+ `readme.md` - This file.
+ `docs` folder - 
+ `FinanceAppIonic` folder - 

##Getting Started

TODO: Guide users through getting your code up and running on their own system. In this section you can talk about:

1.	Installation process
2.	Software dependencies
3.	Latest releases
4.	API references

##Build and Test

TODO: Describe and show how to build your code and run the tests. 

##Contribute

TODO: Explain how other users and developers can contribute to make your code better. 
