'use strict';


angular.module('jsonTranslator', ['ngJSONPath'])
    .service('jsonTranslator', function (jsonPath) {

        this.translateCicStatSet = function(input){
            var statRootPath = 'data.[0].statisticValueChanges';
            var statNamePath = 'statisticKey.statisticIdentifier';
            var workgroupPath = 'statisticKey.parameterValueItems.value';            
            var valuePath = 'statisticValue.value';

            var statRoot = jsonPath(input, statRootPath);
            
            console.debug(input);
            console.debug(statRoot);
        }               
    });