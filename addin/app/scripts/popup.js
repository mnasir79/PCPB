var token;

// Logout
$('a#signout').click(function () {
  chrome.storage.local.remove("powerbi_access_token");
  console.warn("You have logged out from PowerBI.");
  return false;
});

// Connect to PowerBI
$('#connectButton_PowerBI').click(function () {
  var clientId = '4f824f48-924a-44e8-aa5a-1a9383ca4810'; //TODO Get this from options
  
  // Pop up login window. The rest of the processing is handled by login.js
  newwindow = window.open('https://login.windows.net/common/oauth2/authorize?resource=https%3A%2F%2Fanalysis.windows.net%2Fpowerbi%2Fapi&client_id='+clientId+'&response_type=code&redirect_uri=https://login.live.com/oauth20_desktop.srf&site_id=500453', 'name', 'height=700,width=550');
});