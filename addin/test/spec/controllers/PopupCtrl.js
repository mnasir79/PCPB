describe('Popup Controller', function () {
  'use strict';
    
  var scope;

  beforeEach(function() {
    module('app');
  });

  beforeEach(inject(function($rootScope, $controller) {
    scope = $rootScope.$new();
    $controller('PopupCtrl', {
      $scope: scope
    });
  }));

  it('Should expose a testLog function', function() {
    expect(scope.testLog).to.not.be.undefined;
  });
});