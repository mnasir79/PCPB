# Analytics Hub

An easy to deploy and configure hub between PureCloud, CIC and dashboard applications and allow you to create dashboards without any development knowledge

## Install

Install from the Google Chrome Store: 

## Dev setup

* Install [node.js](https://nodejs.org/en/) stable version
* Clone this repository
* Run `npm install -g gulp bower`
* Run `cd addin`
* Run `npm install`
* Run `gulp watch`
* Go to: `chrome://extensions`, enable Developer mode and load app as an unpacked extension and select the 'app' folder.
* To run provider tests (i.e. loggerProvider), run `karma start` from the `addin` folder
* To run controller tests (i.e. popupCtrl), open the `test/index.html` page in your browser (no http server required)

Google Chrome documentation: https://developer.chrome.com/extensions/devguide