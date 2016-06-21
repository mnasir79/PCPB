'use strict';

/**
 * @ngdoc function
 * @name app.provider:$log
 * @description
 * # $log
 */
angular.module('loggerProvider', [])
  .provider('logger', function() {
    var NAME = 'ININ.ECCEMEA.AnalyticsHub.Logger';
    var log = log4javascript.getLogger('ININ.ECCEMEA.AnalyticsHub');
    
    /* ---------------------------------------------------------------------- */
    // LocalStorageAppender
    function LocalStorageAppender() { }

    LocalStorageAppender.prototype = new log4javascript.Appender();
    LocalStorageAppender.prototype.layout = new log4javascript.NullLayout();
    LocalStorageAppender.prototype.threshold = log4javascript.Level.ALL;
    LocalStorageAppender.prototype.append = function(loggingEvent) {
      var appender = this;

      var getFormattedMessage = function() {
        var layout = appender.getLayout();
        var formattedMessage = layout.format(loggingEvent);
        if (layout.ignoresThrowable() && loggingEvent.exception) {
          formattedMessage += loggingEvent.getThrowableStrRep();
        }
        formattedMessage = '"' + loggingEvent.logger.name + '";"' + loggingEvent.level.name + '";"' + formattedMessage.toString().replace(new RegExp('"', 'g'), '""') + '"';
        return formattedMessage;
      };

      var padWithZeroes = function(str, len) {
        while (str.length < len) {
          str = '0' + str;
        }
        return str;
      };

      var getLocalDate = function() {
        var now = loggingEvent.timeStamp,
          tzo = -now.getTimezoneOffset(),
          dif = tzo >= 0 ? '+' : '-',
          pad = function(num) {
            var norm = Math.abs(Math.floor(num));
            return (norm < 10 ? '0' : '') + norm;
          };
        return now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate()) + 'T' + pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds()) + '.' + padWithZeroes(now.getMilliseconds().toString(), 3) + dif + pad(tzo / 60) + ':' + pad(tzo % 60);
      };

      if (store.enabled) {
        var formattedMessage = getFormattedMessage();
        store.set([NAME, getLocalDate()], formattedMessage);
      }
    };

    LocalStorageAppender.prototype.toString = function() {
      return 'LocalStorageAppender';
    };

    log4javascript.LocalStorageAppender = LocalStorageAppender;
    /* ---------------------------------------------------------------------- */
    // Logger
    var consoleAppender = new log4javascript.BrowserConsoleAppender();
    consoleAppender.setLayout(new log4javascript.PatternLayout('%d{HH:mm:ss,SSS} %c %p %m'));
    consoleAppender.setThreshold(log4javascript.Level.ALL);
    log.addAppender(consoleAppender);

    var localStorageAppender = new log4javascript.LocalStorageAppender();
    localStorageAppender.setThreshold(log4javascript.Level.ALL);
    log.addAppender(localStorageAppender);


    this.trace = function(message, exception) {
      log.trace(message, exception);
    };

    this.trace = function(message) {
      log.trace(message);
    };

    this.debug = function(message, exception) {
      log.debug(message, exception);
    };

    this.debug = function(message) {
      log.debug(message);
    };

    this.info = function(message, exception) {
      log.info(message, exception);
    };

    this.info = function(message) {
      log.info(message);
    };

    this.warn = function(message, exception) {
      log.warn(message, exception);
    };

    this.warn = function(message) {
      log.warn(message);
    };

    this.error = function(message, exception) {
      log.error(message, exception);
    };

    this.error = function(message) {
      log.error(message);
    };

    this.fatal = function(message, exception) {
      log.fatal(message, exception);
    };

    this.fatal = function(message) {
      log.fatal(message);
    };

    this.isEnabledFor = function(level, exception) {
      return log.isEnabledFor(level, exception);
    };

    this.isTraceEnabled = function() {
      return log.isTraceEnabled();
    };

    this.isDebugEnabled = function() {
      return log.isDebugEnabled();
    };

    this.isInfoEnabled = function() {
      return log.isInfoEnabled();
    };

    this.isWarnEnabled = function() {
      return log.isWarnEnabled();
    };

    this.isErrorEnabled = function() {
      return log.isErrorEnabled();
    };

    this.isFatalEnabled = function() {
      return log.isFatalEnabled();
    };

    this.assert = function(expr) {
      log.assert(expr);
    };

    this.setEnabled = function(enabled) {
      log.setEnabled(enabled);
    };

    this.isEnabled = function() {
      return log.isEnabled();
    };

    /**
     * @description
     * log4javascript.Level.ALL
     * log4javascript.Level.TRACE
     * log4javascript.Level.DEBUG
     * log4javascript.Level.INFO
     * log4javascript.Level.WARN
     * log4javascript.Level.ERROR
     * log4javascript.Level.FATAL
     * log4javascript.Level.OFF
     */
    this.setLevel = function(level) {
      log.setLevel(level);
    };

    /**
     * @description
     * log4javascript.Level.ALL
     * log4javascript.Level.TRACE
     * log4javascript.Level.DEBUG
     * log4javascript.Level.INFO
     * log4javascript.Level.WARN
     * log4javascript.Level.ERROR
     * log4javascript.Level.FATAL
     * log4javascript.Level.OFF
     */
    this.getLevel = function() {
      return log.getLevel();
    };

    this.isLocalStorageSupported = function() {
      return store.enabled;
    };

    this.setLocalStorageEnabled = function(enabled) {
      if (enabled) {
        log.addAppender(localStorageAppender);
      }
      else {
        log.removeAppender(localStorageAppender);
      }
    };

    this.exportLogs = function() {
      var result = '';
      store.forEach(function(key, value) {
        if (key && key.startsWith(NAME + ',')) {
          key = key.substr(NAME.length + 1);
          result += '"' + key + '";' + value + '\n';
        }
      });
      return result;
    };

    this.clearLogs = function() {
      var allStoreMessages = store.getAll();
      if (allStoreMessages) {
        for (var key in allStoreMessages) {
          if (key && key.startsWith(NAME + ',')) {
            store.remove(key);
          }
        }
      }
    };

    this.downloadLogs = function(fileName) {
      var csvContent = this.exportLogs();
      var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, fileName);
      } else {
        var link = document.createElement('a');
        if (link.download !== undefined) { // feature detection
          // Browsers that support HTML5 download attribute
          var url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', fileName);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    };

    this.$get = function() {
      return this;
    };
  });