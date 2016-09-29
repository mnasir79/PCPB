'use strict';


angular.module('jsonTranslator', ['ngJSONPath'])
    .service('jsonTranslator', function (jsonPath) {

        this.translateCicStatSet = function (input) {
            // getting an array with statistics
            var statRoot = input;

            // creating an output object
            var output = { "data": [] };

            // iterating all statistics in the array
            for (var i in statRoot) {
                var workgroup = statRoot[i].statisticKey.parameterValueItems[0].value;
                var statName = statRoot[i].statisticKey.statisticIdentifier.replace('inin.workgroup:', '');
                var value = statRoot[i].statisticValue ? statRoot[i].statisticValue.value : undefined;
                var item = output.data.find(function (item) { return item.name === workgroup; });

                if (item) {
                    // <updating the existing workgroup>                    
                    for (var j in output.data) {
                        if (output.data[j].name == workgroup) {
                            output.data[j][statName] = adjustValueForCicOutput(value);
                        }
                    }
                    // </updating the existing workgroup>                 
                }
                else {
                    // <creating a new workgroup>

                    var newItem = {};
                    newItem.name = workgroup;
                    newItem.timeStamp = adjustValueForCicOutput(new Date());
                    newItem[statName] = adjustValueForCicOutput(value);
                    output.data.push(newItem);
                    // </creating a new workgroup>
                }

            }
            return output;
        };

        this.translatePcStatSet = function (input) {
            // getting an array with statistics
            
            var statRoot = input.results;

            // creating an output object
            var output = { "data": [] };

            // iterating all statistics in the array
            for (var i in statRoot) {
                var queue = statRoot[i].group.queueName;
                var mediaType = statRoot[i].group.mediaType;
                var queueStatRoot = statRoot[i].data;
                for (var j in queueStatRoot) {
                    var metric = queueStatRoot[j].metric;
                    var value = queueStatRoot[j].stats.count;
                    var item = output.data.find(function (item) { return item.name === queue; });
                    // adding media type to metric name                   
                    if (mediaType) {
                        metric = mediaType + '-' + metric;
                    }
                    if (item) {
                        // <updating the existing queue>                    
                        for (var k in output.data) {
                            if (output.data[k].name == queue) {
                                output.data[k][metric] = value;
                            }
                        }
                        // </updating the existing queue>                 
                    }
                    else {
                        // <creating a new queue>
                        var newItem = {};
                        newItem.name = queue;
                        newItem.timeStamp = adjustValueForCicOutput(new Date());
                        newItem[metric] = value;
                        output.data.push(newItem);
                        // </creating a new queue>
                    }
                }
            }
            return output;
        };

        function adjustValueForCicOutput(oldVal) {
            var newVal = oldVal;
            // <correct date format>
            //var rex = /(\d{8})T(\d{6})Z/; // expression for 20160622T102319Z
            var rex = /(\d{8})T(\d{6})/;            
            if (rex.test(oldVal)) {
                
                // converting 20160622T102319Z to 2016-06-22T12:23:19+02:00  
                //moment('01/01/2016 some text', 'MM/DD/YYYY', true).format()
                newVal = moment(oldVal, "YYYYMMDDThhmmssZ").format();
            }
            // </correct date format>

            // you can add another transformations here if necessery...                            
            return newVal;
        }
    });