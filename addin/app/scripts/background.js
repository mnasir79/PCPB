'use strict';

var accessToken;

function getController() {
  var scope = angular.element(document.getElementById('backgroundCtrl')).scope();
  return scope;
}

//Adding handlers when messages are received from scripts
chrome.extension.onMessage.addListener(function (response, sender) {
  switch (response.target) {
    case 'PowerBI':
      chrome.storage.local.get('powerbi_access_token', function (result) {
        if (result.powerbi_access_token !== null) {
          accessToken = result.powerbi_access_token;
          DataSetExists(response.dataset, function (dataSetId) {
            if (dataSetId) {
              console.log(response.dataset, 'dataset found!:', dataSetId);
            } else {
              console.log(response.dataset, 'dataset NOT found!');
              dataSetId = CreateDataSet();
              console.log('New Dataset Id:', dataSetId);
            }

            // Add rows
            console.log(response);
            console.log('Adding data:', response.rows, 'to', response.table, ' table');
            AddRows(dataSetId, response.table, response.rows);
          });
        } else {
          console.error('Please sign in to PowerBI first.');
        }
      });
      break;
    default:
      console.error('Unknown target:', response.target);
  }
});