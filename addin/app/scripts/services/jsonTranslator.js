'use strict';


angular.module('jsonTranslator', ['ngJSONPath'])
    .service('jsonTranslator', function (jsonPath) {

        this.translateCicStatSet = function (input) {
            // initializing json paths  


            console.debug(adjustValueForCicOutput('20160624T073813.198Z'));


            var statNamePath = 'statisticKey.statisticIdentifier'; //relative
            var workgroupPath = 'statisticKey.parameterValueItems[0].value'; //relative           
            var valuePath = 'statisticValue.value'; //relative

            // getting an array with statistics
            var statRoot = input;

            // creating an output object
            var output = { "data": [] };

            // iterating all statistics in the array
            for (var i in statRoot) {
                var workgroup = jsonPath(statRoot[i], workgroupPath)[0];
                var statName = jsonPath(statRoot[i], statNamePath)[0].replace('inin.workgroup:', '');
                var value = jsonPath(statRoot[i], valuePath)[0];
                var item = jsonPath(output, "$.data.[?(@.name==='" + workgroup + "')]");

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

                    var newItem = new Object();
                    newItem['name'] = workgroup;
                    newItem[statName] = adjustValueForCicOutput(value);
                    output.data.push(newItem);
                    // </creating a new workgroup>
                }

            }

            console.log(output);
            for (var i = 0; i < output.data.length; i++) {
                // Add TimeStamp
                output.data[i]["timeStamp"] = adjustValueForCicOutput(new Date());
            }

            return output;
        }

        this.translatePcStatSet = function (input) {
            // initializing json paths            
            var queuePath = 'group.queueName'; //relative
            var mediaTypePath = 'group.mediaType'; //relative 
            var queueStatRootPath = 'data'; //relative              
            var metricPath = 'metric'; //relative         
            var valuePath = 'stats.count'; //relative

            // getting an array with statistics
            var statRoot = input.results;

            // creating an output object
            var output = { "data": [] };

            // iterating all statistics in the array
            for (var i in statRoot) {
                var queue = jsonPath(statRoot[i], queuePath)[0];
                var mediaType = jsonPath(statRoot[i], mediaTypePath)[0];
                var queueStatRoot = jsonPath(statRoot[i], queueStatRootPath)[0];
                for (var j in queueStatRoot) {
                    var metric = jsonPath(queueStatRoot[j], metricPath)[0];
                    var value = jsonPath(queueStatRoot[j], valuePath)[0];
                    var item = jsonPath(output, "$.data.[?(@.name==='" + queue + "')]");
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
                        var newItem = new Object();
                        newItem['name'] = queue;
                        newItem[metric] = value;
                        output.data.push(newItem);
                        // </creating a new queue>
                    }
                }
            }
            for (var i = 0; i < output.data.length; i++) {
                // Add TimeStamp
                output.data[i]["timeStamp"] = adjustValueForCicOutput(new Date());
            }
            return output;
        }

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