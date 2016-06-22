'use strict';


angular.module('jsonTranslator', ['ngJSONPath'])
    .service('jsonTranslator', function (jsonPath) {

        this.translateCicStatSet = function (input) {
            // initializing json paths
            var statRootPath = '$.[0].statisticValueChanges'; //absolute
            var statNamePath = 'statisticKey.statisticIdentifier'; //relative
            var workgroupPath = 'statisticKey.parameterValueItems[0].value'; //relative           
            var valuePath = 'statisticValue.value'; //relative

            // getting an array with statistics
            var statRoot = jsonPath(input, statRootPath)[0];
            
            // creating an output object
            var output = { "data" : [] };
            
            // iterating all statistics in the array
            for (var i in statRoot) {
                var workgroup = jsonPath(statRoot[i], workgroupPath)[0];
                var statName = jsonPath(statRoot[i], statNamePath)[0].replace('inin.workgroup:','');                                              
                var value = jsonPath(statRoot[i], valuePath)[0];
                var item = jsonPath(output, "$.data.[?(@.name==='" + workgroup + "')]");
                if (item) {
                    // <updating the existing workgroup>                    
                    for (var j in output.data){                         
                        if (output.data[j].name == workgroup){
                            output.data[j][statName] = value;
                        }
                    }   
                    // </updating the existing workgroup>                 
                }
                else {
                    // <creating a new workgroup>
                    var newItem = new Object();
                    newItem['name'] = workgroup;
                    newItem[statName] = value;
                    output.data.push(newItem);
                    // </creating a new workgroup>
                }
            }
            return output;
        }
    });