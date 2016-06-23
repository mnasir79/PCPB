'use strict';

var _accessToken;
var clientId = '4f824f48-924a-44e8-aa5a-1a9383ca4810';

if (window.location.origin === 'https://login.live.com') {
  console.log(window.location.href);
  var hash = window.location.href.split('?')[1];

  // get access code
  var start = hash.indexOf('code=');
  if (start >= 0) {
    start = start + 'code='.length;
    var end = hash.indexOf('&session_state');
    var accessCode = hash.substring(start, end);

    // Get Access token
    getAccessToken(clientId, accessCode, function () {
      window.close();
    }, function () {
      console.log('Redirecting to login page...');
      window.location.assign('https://login.windows.net/common/oauth2/authorize?resource=https%3A%2F%2Fanalysis.windows.net%2Fpowerbi%2Fapi&client_id=' + clientId + '&response_type=code&redirect_uri=https://login.live.com/oauth20_desktop.srf&site_id=500453', 'name', 'height=700,width=550');
    });
  }
}

function getAccessToken(clientId, accessCode, successCallback, failureCallback) {
  var XHR = new XMLHttpRequest();

  XHR.onreadystatechange = function () {
    if (XHR.readyState === 4) {
      switch (XHR.status) {
        case 200:
          JSON.parse(XHR.response, function (k, v) {
            if (k.toString() === 'access_token') {
              _accessToken = v;

              // Store the access token
              if (_accessToken) {
                chrome.storage.local.set({ 'powerbi_access_token': _accessToken }, function () {
                  console.log('Access token saved');
                });
              }

              if (successCallback) {
                successCallback();
              }

              return;
            }
          });

          break;
        case 400:
          console.error('request error:', XHR);
          if (failureCallback) {
            failureCallback(XHR);
          }
          break;
        default:
          console.error('Received status:', XHR.status, '. XHR:', XHR);
      }
    }
  };
  XHR.open('POST', 'https://login.windows.net/common/oauth2/token', false);
  XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  XHR.send('client_id=' + clientId + '&redirect_uri=https://login.live.com/oauth20_desktop.srf&grant_type=authorization_code&code=' + accessCode);
}