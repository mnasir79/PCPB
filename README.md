# Analytics Hub

An easy to deploy and configure hub between PureCloud, CIC and dashboard applications and allow you to create dashboards without any development knowledge

## Install

Install from the Google Chrome Store: 

## Dev setup

* Install [node.js](https://nodejs.org/en/) stable version
* Clone this repository
* Run `cd analytics-hub`
* Run `npm install -g gulp bower karma-cli`
* Run `cd addin`
* Run `npm install`
* Run `bower install`
* Run `gulp watch`
* Go to: `chrome://extensions`, enable Developer mode and load app as an unpacked extension and select the 'app' folder.
* To run unit tests, run `karma start` from the `addin` folder

Google Chrome documentation: https://developer.chrome.com/extensions/devguide

## Options - guidelines for developers

The Analytics Hub stores its configuration in the chrome.storage - https://developer.chrome.com/extensions/storage . The configuration can be modified through the Options page. Other modules of the extension should be able to read parameters. It could be achieved in two ways:

* Use a built-in into the extensions API method chrome.storage.local.get().

* Or if you are going to get the configuration in the AngularJS application you can just use the module called ‘chromeStorage’: https://github.com/infomofo/angular-chrome-storage . It is already imported into the project.

The following keys are available:

* __pbiOptions__ - contains an object with Power BI configuration.

* __pcOptions__ - contains an object with PureCloud configuration.

* __icOptions__ - contains an object with CIC configuration.

* __gOptions__ - contains an object with a general configuration.


## cicService - guidelines for developers

cicService is a service that acts like a bridge between Analytics Hub and CIC server.

Available functions:

* __cicService.Login()__ - login to the CIC server
* __cicService.Logoff()__ - logoff from the CIC server
* __cicService.GetVersion()__ - get information about CIC server (no login required)
* __cicService.ShouldReconnect()__ - check if connection is still active
* __cicService.GetWorkgroups()__ - get all available workgroups from CIC server
* __cicService.Subscrive(in:JSON)__ - subscribe for statistics to watch
* __cicService.GetMessage()__ - get newest set of subscribed statistics


### Below sample scenario: ###


To retrieve live statistics from CIC server, first cicService should get `_sessionId` and `_accessToken` from CIC Server. 

To complete that you should call function `cicService.Login();`

Every 20-30 sec. you should call function `cicService.ShouldReconnect();`

When its return TRUE, you should login again (switchover, connections issues, subsystem restarted).

After successful connection, you should subscribe for statistics that you want to get from a Server.

Call for `cicService.Subscribe(JSON);`

This function as an input gets JSON with statistics to get.

Sample JSON :

`'statisticKeys':
          [
              {
                  "statisticIdentifier": "inin.workgroup:AgentsLoggedIn",
                  "parameterValueItems":
                  [
                      {
                          "parameterTypeId": "ININ.People.WorkgroupStats:Workgroup",
                          "value": "Marketing"
                      }
                  ]
              }
          ]
      }`

Full list of available statisticsIdentifiers are available at: https://developer.inin.com/documentation/Documents/ICWS/WebHelp/ConceptualContent/StatisticsCatalog.htm

After successful subscribe (Status:200) you can call function `cicService.GetMessage();` to get newest statistics.