describe('CIC Service', function() {
  'use strict';
  
  var cicService;
  
  beforeEach(function() {
    module('cicService');
  });
  
  beforeEach(function() {
    inject(function(_cicService_) {
      cicService = _cicService_;
    });
  });
    
  describe('Service tests', function() {
    
    it('should have cicService service be defined', function () {
      expect(cicService).toBeDefined();
    });

    it('should have a login function', function () {
      expect(cicService.Login).toBeDefined();
    });

    it('should have a logoff function', function () {
      expect(cicService.Logoff).toBeDefined();
    });

    it('should have a sendRestRequest function', function () {
      expect(cicService.sendRestRequest).toBeDefined();
    });
    
  });
  
});