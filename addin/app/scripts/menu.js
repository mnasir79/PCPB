'use strict';

var CSS_CLASS_CONNECTED = 'label-success';
var CSS_CLASS_DISCONNECTED = 'label-danger';

var background = chrome.extension.getBackgroundPage();

document.addEventListener('DOMContentLoaded', function () {
    $('#connectButton_PC').bind('click', function(){ toggleConnectionIndicator(this.id);});
    $('#connectButton_CIC').bind('click', function(){ toggleConnectionIndicator(this.id);});
    $('#connectButton_PowerBI').bind('click', function(){ toggleConnectionIndicator(this.id);});
    $('#link_started').bind('click', function(){ openUrl(this.href);});
    $('#link_issues').bind('click', function(){ openUrl(this.href);});
});

document.addEventListener('DOMContentLoaded', function () {
    initConnectionIndicator('connectionIndicator_PC');
    initConnectionIndicator('connectionIndicator_CIC');
    initConnectionIndicator('connectionIndicator_PowerBI');
    console.log('menu loaded succesfully');
});

function setConnected(id) {
    var arr = id.split('_');
    var id = "connectionIndicator_" + arr[1];
    var jquery_id = '#' + id;
    $(jquery_id).removeClass(CSS_CLASS_DISCONNECTED);
    $(jquery_id).addClass(CSS_CLASS_CONNECTED);
    background.cssClass[id] = CSS_CLASS_CONNECTED;
    console.log(id + ' changed from disconnected to connected');
}

function setDisconnected(id) {
    var arr = id.split('_');
    var id = "connectionIndicator_" + arr[1];
    var jquery_id = '#' + id;
    $(jquery_id).removeClass(CSS_CLASS_CONNECTED);
    $(jquery_id).addClass(CSS_CLASS_DISCONNECTED);
    background.cssClass[id] = CSS_CLASS_DISCONNECTED;
    console.log(id + ' changed from connected to disconnected');
}

function toggleConnectionIndicator(id) {
    var arr = id.split('_');
    var id = "connectionIndicator_" + arr[1];
    var jquery_id = '#' + id;
    if ($(jquery_id).hasClass(CSS_CLASS_CONNECTED)) {
       setDisconnected(id)
    }
    else if ($(jquery_id).hasClass(CSS_CLASS_DISCONNECTED)) {
        setConnected(id);
    }     
}

function openUrl(url) {
    chrome.tabs.create({ url: url });
}

function initConnectionIndicator(id) {
    if (typeof background.cssClass[id] == 'undefined') {
        background.cssClass[id] = CSS_CLASS_DISCONNECTED;
    }
    else if (background.cssClass[id] == CSS_CLASS_DISCONNECTED) {
        setDisconnected(id);
    }
    else if (background.cssClass[id] == CSS_CLASS_CONNECTED) {
        setConnected(id);
    }
}