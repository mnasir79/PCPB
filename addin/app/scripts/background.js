'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

console.log('Chrome Extension Id: ' + chrome.runtime.id);
console.log('\'Allo \'Allo! Event Page for Browser Action');