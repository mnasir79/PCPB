'use strict';

angular.module('powerbiService', ['chromeStorage'])

  .service('powerbiService', function($rootScope, $window, $http, $log, chromeStorage) {
    //console.debug('PowerBI Service started');

    var accessToken;

    // This watches for the access token in the local storage
    // The current module used (chromeStorage (https://github.com/infomofo/angular-chrome-storage)) does not have that functionality
    // This can be resource-intensive so we might need to find a better way of doing this
    // The same code is also in popupCtrl.js as there was an issue when logging off and logging back in that cause the isPowerBIConnected var to not update ng-class to turn the button green
    $rootScope.$watch(function() {
      chromeStorage.get('powerbi_access_token').then(function(retrievedAccessToken) {
        accessToken = retrievedAccessToken;
        $rootScope.isPowerBIConnected = retrievedAccessToken !== undefined;
        //console.log('retrieved token:', retrievedAccessToken !== undefined);
      });
    }, null);

    // Load Enviroment Options from ChromeLocalStorage
    // ===============
    // chromeStorage.get('icOptions').then(function (icOptions) {
    //   _host = icOptions.icIcServer;
    //   _port = icOptions.icPort;
    //   _icUsername = icOptions.icUsername;
    //   _icPassword = icOptions.icPassword;
    //   _icUseSsl = icOptions.icUseSsl;
    // });
    
    this.Logoff = function(callback) {
      console.log('Clearing PowerBI token');
      chromeStorage.drop('powerbi_access_token');
      $rootScope.isPowerBIConnected = false;
      if (callback) {
        callback();
      }
    };
    
    this.SendToPowerBI = function(dataset, table, rows) {
      if ($rootScope.isPowerBIConnected) {
        // Creates the dataset it if it doesn't exist yet
        DataSetExists(dataset, function (dataSetId) {
          if (dataSetId) {
            console.log(dataset, 'dataset found!:', dataSetId);
            // Remove rows
            // console.log('Delete Rows');
            // console.log(DeleteRows(dataSetId, table));
            // Add rows
            console.log('Dataset:', dataset, '. Table:', table, '. Adding rows:', rows);
            AddRows(dataSetId, table, rows);
          } else {
            console.log(dataset, 'dataset NOT found!');
            CreateDataSet(dataset, function(responseText) {
              var dataSetId = responseText.id;
              console.log('New Dataset Id:', dataSetId);
              // Add rows
              console.log('Dataset:', dataset, '. Table:', table, '. Adding rows:', rows);
              AddRows(dataSetId, table, rows);
            });
          }
        });
      } else {
        console.error('Please sign in to PowerBI first.');
      }
    };
    
    // Check if a PowerBI dataset exists
    function DataSetExists(name, callback) {
      PBIGet('https://api.powerbi.com/v1.0/myorg/datasets', function(data) {
        var pureCloudDataSets = getObjects(data, 'name', name);
        if (pureCloudDataSets.length > 0) {
          if (callback) { 
            callback(pureCloudDataSets[0].id); 
          }
        } else {
          if (callback) {
            callback(undefined);
          }
        }
      });
    }

    // Create a PowerBI dataset
    function CreateDataSet(name, callback) {
      //We have to hardcode the tables and it sucks since we can't add tables to an existing dataset
      //Feature requests: 
      //  https://ideas.powerbi.com/forums/268152-developer-apis/suggestions/7111791-alter-datasets-by-adding-removing-individual-table
      //  https://ideas.powerbi.com/forums/268152-developer-apis/suggestions/10445529-add-rest-api-call-to-add-new-table-to-existing-dat 
      
      switch(name) 
      {
        case 'CIC':
          $.getJSON('scripts/schemas/powerBiCicTableSchema.json', function(json) {
            return PBIPost('https://api.powerbi.com/v1.0/myorg/datasets?defaultRetentionPolicy=None', json, callback);
          });
          break;
        case 'PureCloud':
          $.getJSON('scripts/schemas/powerBiPureCloudTableSchema.json', function(json) {
            return PBIPost('https://api.powerbi.com/v1.0/myorg/datasets?defaultRetentionPolicy=None', json, callback);
          });
          break;
        default:
          console.error('Unknown dataset name:', name, '. Valid values: CIC or PureCloud');
      }
    }

    // Add rows to a dataset table
    function AddRows(dataSetId, tableName, data) {
      return PBIPost('https://api.powerbi.com/v1.0/myorg/datasets/' + dataSetId + '/tables/' + tableName + '/rows', data);
    }

    // Delete rows to a dataset table
    function DeleteRows(dataSetId, tableName) {
      console.log(dataSetId);
      return PBIDelete('https://api.powerbi.com/v1.0/myorg/datasets/' + dataSetId + '/tables/' + tableName + '/rows');
    }


    // PowerBI GET
    function PBIGet(url, callback) {
      var request = new XMLHttpRequest();

      // Create new HTTP GET request
      request.open('GET', url);
      request.setRequestHeader('Content-Type', 'application/json'); 
      request.setRequestHeader('Authorization', 'Bearer ' + accessToken);

      request.onreadystatechange = function () {
        if (this.readyState === 4) {
          var response = JSON.parse(this.response);
          switch(this.status) {
            case 200: // OK
              var data = JSON.parse(this.responseText).value;
              if (callback) {
                callback(data);
              }
              break;
            case 403: // Forbidden
              if (response.error.code === 'TokenExpired') {
                console.error('Token expired. Need to login to PowerBI');
                //TODO Redirect to login page?
                return;
              }
              break;
            default:
              console.warn('Unhandled response status:', this.status);
              console.warn(response);
          }
        }
      };
      request.send();
    }

    // PowerBI POST
    function PBIPost(url, data, callback) {
      // Create new HTTP POST request
      var request = new XMLHttpRequest();

      request.onreadystatechange = function () {
        if (this.readyState === 4) {
          console.log('Status:', this.status);
          //console.log('Headers:', this.getAllResponseHeaders());
          //console.log('Body:', this.responseText);
          if (this.status === 200 || this.status === 201) {
            if (callback) {
              callback(JSON.parse(this.responseText));
            }
          }
        }
      };
      
      request.open('POST', url, true);

      request.setRequestHeader('Content-Type', 'application/json'); 
      request.setRequestHeader('Authorization', 'Bearer ' + accessToken);
      // Send the request
      console.log('Sending data:', JSON.stringify(data));
      request.send(JSON.stringify(data));
    }

    // PowerBI DELETE
    function PBIDelete(url, data, callback) {
      // Create new HTTP POST request
      var request = new XMLHttpRequest();

      request.onreadystatechange = function () {
        if (this.readyState === 4) {
          console.log('Status:', this.status);
          //console.log('Headers:', this.getAllResponseHeaders());
          console.log('Body:', this.responseText);
          if (this.status === 200 || this.status === 201) {
            if (callback) {
              callback(JSON.parse(this.responseText));
            }
          }
        }
      };
      
      request.open('DELETE', url, true);

      request.setRequestHeader('Content-Type', 'application/json'); 
      request.setRequestHeader('Authorization', 'Bearer ' + accessToken);
      // Send the request
      console.log('Sending data:', JSON.stringify(data));
      request.send(JSON.stringify(data));
    }


    //return an array of objects according to key, value, or key and value matching
    function getObjects(obj, key, val) {
      var objects = [];
      for (var i in obj) {
        if (!obj.hasOwnProperty(i)) {
          continue;
        }
        if (typeof obj[i] === 'object') {
          objects = objects.concat(getObjects(obj[i], key, val));    
        } else 
        //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
        if (i === key && obj[i] === val || i === key && val === '') { //
          objects.push(obj);
        } else if (obj[i] === val && key === ''){
          //only add if the object is not already in the array
          if (objects.lastIndexOf(obj) === -1){
              objects.push(obj);
          }
        }
      }
      return objects;
    }

    //return an array of values that match on a certain key
    function getValues(obj, key) {
      var objects = [];
      for (var i in obj) {
        if (!obj.hasOwnProperty(i)) {
          continue;
        }
        if (typeof obj[i] === 'object') {
            objects = objects.concat(getValues(obj[i], key));
        } else if (i === key) {
            objects.push(obj[i]);
        }
      }
      return objects;
    }

    //return an array of keys that match on a certain value
    function getKeys(obj, val) {
      var objects = [];
      for (var i in obj) {
        if (!obj.hasOwnProperty(i)) {
          continue;
        }
        if (typeof obj[i] === 'object') {
          objects = objects.concat(getKeys(obj[i], val));
        } else if (obj[i] === val) {
          objects.push(i);
        }
      }
      return objects;
    }
  });