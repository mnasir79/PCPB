describe('Logger Provider', function() {
  'use strict';
  
  var $log;
  
  beforeEach(function() {
    module('loggerProvider');
  });
  
  beforeEach(function() {
    inject(function(_logger_) {
      $log = _logger_;
      $log.setLocalStorageEnabled(true);
    });
  });
    
  describe('Basic tests', function() {
    
    it('$log.clearLogs', function() {
      expect(function() {
        $log.clearLogs();
      }).not.toThrow();
    });

    it('$log.info', function() {
      expect($log.info).toBeDefined();
      expect(function() {
        $log.info('it worked!');
      }).not.toThrow();
      var c = $log.exportLogs();
      expect(c).toMatch('it worked!');
    });

    it('$log.clearLogs', function() {
      expect(function() {
        $log.clearLogs();
      }).not.toThrow();
    });
  });
  
});