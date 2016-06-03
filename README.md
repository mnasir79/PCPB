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

Azure application configuration: https://manage.windowsazure.com/inin.onmicrosoft.com#Workspaces/ActiveDirectoryExtension/Directory/8d07eb62-a903-4bae-bcc2-66c244e76b27/ClientApp/4f824f48-924a-44e8-aa5a-1a9383ca4810/clientAppConfigure

## Options - guidelines for developers

The Analytics Hub stores its configuration in the chrome.storage - https://developer.chrome.com/extensions/storage . The configuration can be modified through the Options page. Other modules of the extension should be able to read parameters. It could be achieved in two ways:

* Use a built-in into the extensions API method chrome.storage.local.get().

* Or if you are going to get the configuration in the AngularJS application you can just use the module called ‘chromeStorage’: https://github.com/infomofo/angular-chrome-storage . It is already imported into the project.

The following keys are available:

* __pbiOptions__ - contains an object with Power BI configuration.

* __pcOptions__ - contains an object with PureCloud configuration.

* __icOptions__ - contains an object with CIC configuration.

* __gOptions__ - contains an object with a general configuration.