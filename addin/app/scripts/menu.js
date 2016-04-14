'use strict';

var CSS_CLASS_CONNECTED = 'label-success';
var CSS_CLASS_DISCONNECTED = 'label-danger';

var background = chrome.extension.getBackgroundPage();

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