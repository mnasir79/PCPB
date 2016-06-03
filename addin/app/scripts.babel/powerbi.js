'use strict';

// Check if a PowerBI dataset exists
function DataSetExists(name, callback) {
  GetFromPBI('https://api.powerbi.com/v1.0/myorg/datasets', function(data) {
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
function CreateDataSet(name) {
  var body = {
    'name': name,
    'tables': [
      {
        'name': 'Conversations',
        'columns': [
          {
            'name': 'Id',
            'dataType': 'string'
          },
          {
            'name': 'Name',
            'dataType': 'string'
          },
          {
            'name': 'StartTime',
            'dataType': 'DateTime'
          },
          {
            'name': 'EndTime',
            'dataType': 'DateTime'
          },
          {
            'name': 'RecordingState',
            'dataType': 'string'
          }
        ]
      }
    ]
  };
  return SendtoPBI('https://api.powerbi.com/v1.0/myorg/datasets?defaultRetentionPolicy=None', body);
}

// Add rows to a dataset table
function AddRows(dataSetId, tableName, data) {
  return SendtoPBI('https://api.powerbi.com/v1.0/myorg/datasets/' + dataSetId + '/tables/' + tableName + '/rows', data);
}

// PowerBI GET
function GetFromPBI(url, callback) {
  var request = new XMLHttpRequest();

  // Create new HTTP GET request
  request.open('GET', 'https://api.powerbi.com/v1.0/myorg/datasets');
  request.setRequestHeader('Content-Type', 'application/json'); 
  request.setRequestHeader('Authorization', 'Bearer ' + accessToken);

  request.onreadystatechange = function () {
    console.log(this);
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
          if (response.error.code == 'TokenExpired') {
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
function SendtoPBI(url, data, callback) {
  // Create new HTTP POST request
  var request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (this.readyState === 4) {
      console.log('Status:', this.status);
      //console.log('Headers:', this.getAllResponseHeaders());
      //console.log('Body:', this.responseText);
    }
  };
  
  request.open('POST', url, true);

  request.setRequestHeader('Content-Type', 'application/json'); 
  request.setRequestHeader('Authorization', 'Bearer ' + accessToken);
  // Send the request
  console.log('Sending data:', JSON.stringify(data));
  request.send(JSON.stringify(data));
}

//TODO: Probably need to move the functions below to a common library

//return an array of objects according to key, value, or key and value matching
function getObjects(obj, key, val) {
  var objects = [];
  for (var i in obj) {
    if (!obj.hasOwnProperty(i)) continue;
    if (typeof obj[i] == 'object') {
      objects = objects.concat(getObjects(obj[i], key, val));    
    } else 
    //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
    if (i == key && obj[i] == val || i == key && val == '') { //
      objects.push(obj);
    } else if (obj[i] == val && key == ''){
      //only add if the object is not already in the array
      if (objects.lastIndexOf(obj) == -1){
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
    if (!obj.hasOwnProperty(i)) continue;
    if (typeof obj[i] == 'object') {
        objects = objects.concat(getValues(obj[i], key));
    } else if (i == key) {
        objects.push(obj[i]);
    }
  }
  return objects;
}

//return an array of keys that match on a certain value
function getKeys(obj, val) {
  var objects = [];
  for (var i in obj) {
    if (!obj.hasOwnProperty(i)) continue;
    if (typeof obj[i] == 'object') {
      objects = objects.concat(getKeys(obj[i], val));
    } else if (obj[i] == val) {
      objects.push(i);
    }
  }
  return objects;
}