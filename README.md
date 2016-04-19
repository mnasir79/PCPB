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