'use strict';

var cssClass = new Array();

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

chrome.browserAction.setBadgeText({ text: '\'Allo' });

console.log('\'Allo \'Allo! Event Page for Browser Action');