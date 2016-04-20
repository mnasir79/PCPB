'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
    console.log('previousVersion', details.previousVersion);
});

console.log('Chrome Extension Id: ' + chrome.runtime.id);

function getController() {
    var scope = angular.element(document.getElementById("backgroundCtrl")).scope();
    return scope;
}