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
            var output = []; // { "data": [] };
            
            // iterating all statistics in the array
            for (var i in statRoot) {
                var queue = statRoot[i].group.queueName;
                var mediaType = statRoot[i].group.mediaType;
                var queueStatRoot = statRoot[i].data;
                for (var j in queueStatRoot) {
                    var metric = queueStatRoot[j].metric;
                    var value = queueStatRoot[j].stats.count;
                    var item = output.find(function (item) { return item.name === queue; });
                    // adding media type to metric name                   
                    if (mediaType) {
                        metric = mediaType + '-' + metric;
                    }
                    if (item) {
                        // <updating the existing queue>                    
                        for (var k in output) {
                            if (output[k].name == queue) {
                                output[k][metric] = value;
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
                        output.push(newItem);
                        // </creating a new queue>
                    }
                }
            }
            return output;
        };

        this.translatePureCloudConversationDetailDataSet = function (input, skillMap, languageMap) {
            // getting an array with statistics

            var statRoot = input.conversations;

            // creating an output object
            var output = { "data": [] };

            // iterating all statistics in the array
            for (var i in statRoot) {
                var newItem = {};
                newItem.timeStamp = adjustValueForCicOutput(new Date());
                newItem.conversationId = statRoot[i].conversationId;
                newItem.conversationStart = statRoot[i].conversationStart;

                var participantsStatRoot = statRoot[i].participants;
                if (participantsStatRoot.length > 0) {
                    var sessions = participantsStatRoot[0].sessions;
                    if (sessions.length > 0) {
                        newItem.mediaType = sessions[0].mediaType;
                        newItem.direction = sessions[0].direction;
                        newItem.conversationEnd = sessions[sessions.length - 1].segmentEnd;
                    }
                    else {
                        console.warn('Missing sessions for first participants: ' + JSON.stringify(statRoot[i]));
                    }
                }
                else {
                    console.warn('Missing participants: ' + JSON.stringify(statRoot[i]));
                }

                var acdParticipant = participantsStatRoot.find(function (item) { return item.purpose === 'acd'; });
                if (acdParticipant) {
                    newItem.queueName = acdParticipant.participantName;
                    var sessions = acdParticipant.sessions;
                    if (sessions.length > 0 && sessions[0].segments.length > 0) {
                        var segment  = sessions[0].segments[0];
                        if (segment.requestedRoutingSkillIds && segment.requestedRoutingSkillIds.length > 0) {
                            newItem.skill = skillMap[segment.requestedRoutingSkillIds[0]].name;
                        }

                        if (segment.requestedLanguageId) {
                            newItem.language = languageMap[segment.requestedLanguageId].name;
                        }
                    }
                    else {
                        console.warn('Missing sessions for acd participants: ' + JSON.stringify(statRoot[i]));
                    }
                }

                output.data.push(newItem);
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