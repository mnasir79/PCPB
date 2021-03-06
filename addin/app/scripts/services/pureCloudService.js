'use strict';

angular.module('pureCloudService', ['ab-base64', 'powerbiService', 'jsonTranslator', 'chromeStorage'])
	.service('pureCloudService', function ($http, $log, $httpParamSerializerJQLike, $q, base64, powerbiService, jsonTranslator, jsonPath, chromeStorage) {

		var _environment;
		var _host;
		var _authUrl;
		var _queueMap = {};
		var _allQueue = [];
		var _allQueuesPredicate = [];
		var _languageMap = {};
		var _skillMap = {};
		var _clientId;
		var _clientSecret;
		var _authorization;
		var _sendDataToPowerBi;
		var _timer;
		var _isConnected = false;


		function GetOptions() {
			var deferred = $q.defer();
			// Load Enviroment Options from ChromeLocalStorage
			chromeStorage.get('pcOptions').then(function (pcOptions) {
				_clientId = pcOptions.pcClientId;
				_clientSecret = pcOptions.pcClientSecret;
				_environment = pcOptions.pcEnv;
				_timer = pcOptions.pcTimer;
				deferred.resolve();
			}, function error() {
				console.log("unable to read the local storage");
				deferred.reject();
			});
			return deferred.promise;
		}

		this.GetOptions = GetOptions;

		this.getIsConnected = function () {
      return _isConnected;
    };

		function loadStartupData() {
			return $q.all([
				loadQueue(),
				loadLanguages(),
				loadSkills()
			]);
		}

		/*
		 * Gets or Sets environment that this is run in.  If set should be mypurecloud.com, mypurecloud.ie, mypurecloud.com.au, etc.
		 * @memberof pureCloudService#
		 * @param environment
		 * { environment : 'purecloud.com' {string} environment PureCloud environment (mypurecloud.com, mypurecloud.ie, mypurecloud.au, etc)
		 *   clienId : 0c731aeb-d7e6-4fe5-8f24-1fb3055f997e 
		 * }  
		 */
		function setEnvironment() {
			_isConnected = false;
			var deferred = $q.defer();

			this.GetOptions().then(function () {

				_host = 'api.' + _environment;
				_authUrl = 'https://login.' + _environment;

				var key = base64.encode(_clientId + ':' + _clientSecret);

				var config = {
					method: 'POST',
					url: _authUrl + '/oauth/token',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/x-www-form-urlencoded',
						'Authorization': 'Basic ' + key
					},
					data: 'grant_type=client_credentials'
				};

				var requestName = "/oauth/token";

				$http(config)
					.then(function success(response) {
						_authorization = response.data;
						loadStartupData().then(function success() {
							_isConnected = true;

							sendData(); // Call it once (interval only starts when the timer expires)
							_sendDataToPowerBi = setInterval(sendData, _timer);

							deferred.resolve();
						}, function error() {
							deferred.reject();
						});
					}, function error(response) {
						if (response.status === 400 && response.data) {
							console.error('Request: ' + requestName + ': ' + response.data.code + ': ' + response.data.message + ' (' + JSON.stringify(response.data) + ')');
						}
						else {
							console.error('Request: ' + requestName + ': HTTP ' + response.status + ' (' + response.statusText + ')');
						}
						console.error('End Request: ' + requestName);
						deferred.reject();
					});
			}, function error() {
				console.error("error");
				deferred.reject();
			});

			return deferred.promise;
		}
		this.setEnvironment = setEnvironment;

		function sendRestRequest(requestName, method, path, body) {
			if (!_authorization) {
				throw new Error('Authentication required!');
			}
			if (!_host) {
				throw new Error('setEnvironment first!');
			}
			if (!requestName) {
				throw new Error('Missing required parameter: requestName');
			}
			if (!method) {
				throw new Error('Missing required parameter: method');
			}
			if (!path) {
				throw new Error('Missing required parameter: path');
			}

			var options = {
				method: method,
				url: 'https://' + _host + path,
				headers: {
					'Authorization': _authorization.token_type + " " + _authorization.access_token
				},
				data: body
			};

			var request = $http(options);
			request.then(function success() {//response) {
				//console.log('End Request: ' + requestName + ' (' + JSON.stringify(response.data) + ')');
			}, function error(response) {
				if (response.status === 400 && response.data) {
					console.error('Request: ' + requestName + ': ' + response.data.code + ': ' + response.data.message + ' (' + JSON.stringify(response.data) + ')');
				}
				else {
					console.error('Request: ' + requestName + ': HTTP ' + response.status + ' (' + response.statusText + ')');
				}
				console.error('End Request: ' + requestName);
			});

			return request;
		}

	  /**
		 * @summary send data to stat application
		 */
		function sendData() {
			var dateRequest = new Date();
			var dd = dateRequest.getDate();
			var dd_from = dateRequest.getDate() - 1;
			var mm = dateRequest.getMonth() + 1; //January is 0!
			var yyyy = dateRequest.getFullYear();

			if (dd < 10) {
				dd = '0' + dd;
			}

			if (dd_from < 10) {
				dd_from = '0' + dd_from;
			}

			if (mm < 10) {
				mm = '0' + mm;
			}

			var time = 'T' + dateRequest.getHours() + ':' + dateRequest.getMinutes() + ':' + dateRequest.getSeconds();

			dateRequest = yyyy + '-' + mm + '-' + dd_from + time + '/' + yyyy + '-' + mm + '-' + dd + time;
			//console.log(dateRequest);

			return $q.all([
				sendQueueData(dateRequest),
				sendConversationData(dateRequest)
			]);
		}

		function sendQueueData(interval) {
			var deferred = $q.defer();

			var body = {
				"interval": interval,
				//"interval": "2016-06-15T00:00:00.000Z/2016-06-21T00:00:00.000Z",
				"filter": {
					"type": "or",
					"predicates": _allQueuesPredicate
				},
				"metrics": []
			};

			analyticsApi.postQueuesObservationsQuery(body)
				.then(function success(response) {

					// @Daniel Szlaski / Fix for formating
					var wgDataMap = {};

					for (var x in response.data.results) {
						if (response.data.results[x].group.mediaType !== undefined) {
							var in_mediaType = response.data.results[x].group.mediaType;
							for (var y in response.data.results[x].data) {
								response.data.results[x].data[y].metric = in_mediaType + '_' + response.data.results[x].data[y].metric;
								wgDataMap[response.data.results[x].group.queueId].data.push(response.data.results[x].data[y]);
							}
						} else {
							var item = response.data.results[x];

							// add queue name
							var queuePath = 'group'; //relative
							var queue = jsonPath(item, queuePath)[0];
							var q = _queueMap[queue.queueId];
							queue.queueName = q ? q.name : undefined;

							wgDataMap[item.group.queueId] = item;
						}
					}

					// END @Daniel Szlaski / Fix for formating

					// send data to powerbi
					var wgData_parsed = { "results": [] };
					wgData_parsed.results = Object.keys(wgDataMap).map(wg => { return wgDataMap[wg]; });
					var outputStat = jsonTranslator.translatePcStatSet(wgData_parsed);
					console.log(outputStat);
					powerbiService.SendToPowerBI('PureCloud', 'Workgroup', outputStat);

					deferred.resolve();
				}, function error() {
					deferred.reject();
				});

			return deferred.promise;
		}

		function sendConversationData(interval) {
			var deferred = $q.defer();
			var maxPageSize = 100;

			var body = {
				"interval": interval,
				//"interval": "2016-06-15T00:00:00.000Z/2016-06-21T00:00:00.000Z",
				"order": "asc",
				"orderBy": "conversationStart",
				"paging": {
					"pageSize": maxPageSize,
					"pageNumber": 0
				}
			};

			var outputStat = [];
			sendConversationDataInternal(deferred, body, outputStat);
			return deferred.promise;
		}

		function sendConversationDataInternal(deferred, body, outputStat) {
			body.paging.pageNumber++;
			analyticsApi.postConversationsDetailsQuery(body)
				.then(function success(response) {
					var outputStatTmp = jsonTranslator.translatePureCloudConversationDetailDataSet(response.data, _skillMap, _languageMap);
					console.log('Received Conversation Detail Data page number: ' + body.paging.pageNumber);
					//console.log(outputStatTmp);
					outputStat = outputStat.concat(outputStatTmp);

					if (outputStatTmp.length === body.paging.pageSize) {
						sendConversationDataInternal(deferred, body, outputStat);
					} else {
						powerbiService.SendToPowerBI('PureCloud', 'Conversation', outputStat);
						deferred.resolve();
					}
				}, function error() {
					deferred.reject();
				});
		}

		/*
		 * @summary Load the list of queue name and queueid in a table _queueMap
		 */
		function loadQueue() {
			var deferred = $q.defer();

			routingApi.getQueues()
				.then(function success(response) {
					_allQueue = response.data.entities;

					_queueMap = createQueuesMap(_allQueue);
					_allQueuesPredicate = _allQueue.map(q => { return { "dimension": "queueId", "value": q.id }; });

					deferred.resolve();
				}, function error() {
					deferred.reject();
				});
			return deferred.promise;
		}

		function loadLanguages() {
			var deferred = $q.defer();

			languageApi.getLanguages()
				.then(function success(response) {
					_languageMap = createLangaugeMap(response.data.entities);

					deferred.resolve();
				}, function error() {
					deferred.reject();
				});
			return deferred.promise;
		}

		function loadSkills() {
			var deferred = $q.defer();

			routingApi.getSkills()
				.then(function success(response) {
					_skillMap = createSkillMap(response.data.entities);

					deferred.resolve();
				}, function error() {
					deferred.reject();
				});
			return deferred.promise;
		}

		function stopSendDataToPowerBi() {
			_isConnected = false;
			clearTimeout(_sendDataToPowerBi);
		}

		this.stopSendDataToPowerBi = stopSendDataToPowerBi;

		function createQueuesMap(queues) {
			var map = {};
			var length = Object.keys(queues).length;
			for (var i = 0; i < length; i++) {
				var queue = queues[i];
				queue.name = queue.name.replace(/[\\$'"]/g, "\\$&");		//AMO: add escape in case of special character in queue name
				map[queue.id] = queue;
			}
			return map;
		}

		function createLangaugeMap(languages) {
			var map = {};
			var length = Object.keys(languages).length;
			for (var i = 0; i < length; i++) {
				var language = languages[i];
				map[language.id] = language;
			}
			return map;
		}

		function createSkillMap(skills) {
			var map = {};
			var length = Object.keys(skills).length;
			for (var i = 0; i < length; i++) {
				var skill = skills[i];
				map[skill.id] = skill;
			}
			return map;
		}

		var routingApi = {
			/*
			* @summary Get the list of queues
			* @memberOf routing#
			*/
			getQueues: function () {
				var requestBody;
				var apipath = '/api/v2/routing/queues';
				return sendRestRequest('routing.getQueues', 'GET', apipath, requestBody);
			},

			/*
			* @summary Get the detail of a queue
			* @memberOf routing#
			* @param queueId - id of the queue
			*/
			getQueueDetail: function (queueId) {
				var requestBody;
				var apipath = '/api/v2/routing/queues/{queueId}';

				if (!queueId) {
					throw new Error('Missing required  parameter: queueId');
				}

				apipath = apipath.replace('{queueId}', queueId);
				return sendRestRequest('routing.getQueueDetail', 'GET', apipath, requestBody);
			},

			/*
			* @summary Get the list of skills
			* @memberOf routing#
			*/
			getSkills: function () {
				var requestBody;
				var apipath = '/api/v2/routing/skills';
				return sendRestRequest('routing.getSkills', 'GET', apipath, requestBody);
			}
		};

		this.routing = routingApi;

		var analyticsApi = {
			/**
			 * @summary Query for conversation aggregates
			 * @memberOf AnalyticsApi#
			 * @param {} body - query
			 * @example
			 * Body Example:
			 * {
				"interval": "",
				"granularity": "",
				"groupBy": [],
				"filter": {
				"type": "",
				"clauses": [],
				"predicates": []
				},
				"metrics": [],
				"flattenMultivaluedDimensions": true
				}
			*/
			postConversationsAggregatesQuery: function (body) {
				var apipath = '/api/v2/analytics/conversations/aggregates/query';
				var requestBody;
				var queryParameters = {};

				if (body) {
					requestBody = body;
				}
				return sendRestRequest('analytics.postConversationsAggregatesQuery', 'POST', apipath + '?' + $httpParamSerializerJQLike(queryParameters), requestBody);
			},

			/**
			 * @summary Query for conversation details
			 * @memberOf AnalyticsApi#
			 * @param {} body - query
			 * @example
			 * Body Example:
			 * {
				"interval": "",
				"conversationFilters": [],
				"evaluationFilters": [],
				"segmentFilters": [],
				"aggregations": [],
				"paging": {
					"pageSize": 0,
					"pageNumber": 0
					},
					"order": "",
				"orderBy": ""
				}
			*/
			postConversationsDetailsQuery: function (body) {
				var apipath = '/api/v2/analytics/conversations/details/query';
				var requestBody;
				var queryParameters = {};

				if (body) {
					requestBody = body;
				}

				return sendRestRequest('analytics.postConversationsDetailsQuery', 'POST', apipath + '?' + $httpParamSerializerJQLike(queryParameters), requestBody);
			},

			/**
			 * @summary Get a conversation by id
			 * @memberOf AnalyticsApi#
			 * @param {string} conversationId - conversationId
			 */
			getConversationsConversationIdDetails: function (conversationId) {
				var apipath = '/api/v2/analytics/conversations/{conversationId}/details';
				var requestBody;
				var queryParameters = {};

				if (!conversationId) {
					throw new Error('Missing required  parameter: conversationId');
				}

				apipath = apipath.replace('{conversationId}', conversationId);
				return sendRestRequest('analytics.getConversationsConversationIdDetails', 'GET', apipath + '?' + $httpParamSerializerJQLike(queryParameters), requestBody);
			},

			/**
			 * @summary Index conversation properties
			 * @memberOf AnalyticsApi#
			 * @param {string} conversationId - conversationId
			 * @param {} body - request
			 * @example
			 * Body Example:
			 * {
				"sessionId": "",
				"timestamp": 0,
				"properties": []
				}
			*/
			postConversationsConversationIdDetailsProperties: function (conversationId, body) {
				var apipath = '/api/v2/analytics/conversations/{conversationId}/details/properties';
				var requestBody;
				var queryParameters = {};

				if (!conversationId) {
					throw new Error('Missing required  parameter: conversationId');
				}
				apipath = apipath.replace('{conversationId}', conversationId);

				if (body) {
					requestBody = body;
				}

				return sendRestRequest('analytics.postConversationsConversationIdDetailsProperties', 'POST', apipath + '?' + $httpParamSerializerJQLike(queryParameters), requestBody);
			},

			/**
			 * @summary Query for evaluation aggregates
			 * @memberOf AnalyticsApi#
			 * @param {} body - query
			 * @example
			 * Body Example:
			 * {
				"interval": "",
				"granularity": "",
				"groupBy": [],
				"filter": 
				{
					"type": "",
					"clauses": [],
					"predicates": []
				},
				"metrics": [],
				"flattenMultivaluedDimensions": true
				}
			*/
			postEvaluationsAggregatesQuery: function (body) {
				var apipath = '/api/v2/analytics/evaluations/aggregates/query';
				var requestBody;
				var queryParameters = {};

				if (body) {
					requestBody = body;
				}

				return sendRestRequest('analytics.postEvaluationsAggregatesQuery', 'POST', apipath + '?' + $httpParamSerializerJQLike(queryParameters), requestBody);
			},

			/**
			 * @summary Query for queue observations
			 * @memberOf AnalyticsApi#
			 * @param {} body - query
			 * @example
			 * Body Example:
			 * {
				"filter": 
				{
					"type": "",
					"clauses": [],
					"predicates": []
				},
				"metrics": []
				}
			*/
			postQueuesObservationsQuery: function (body) {
				var apipath = '/api/v2/analytics/queues/observations/query';
				var requestBody;
				var queryParameters = {};
				if (body) {
					requestBody = body;
				}

				return sendRestRequest('analytics.postQueuesObservationsQuery', 'POST', apipath + '?' + $httpParamSerializerJQLike(queryParameters), requestBody);
			},

			/**
			 * @summary Get list of reporting metadata.
			 * @memberOf AnalyticsApi#
			 * @param {integer} pageNumber - Page number
			 * @param {integer} pageSize - Page size
			 * @param {string} locale - Locale
			 */
			getReportingMetadata: function (pageNumber, pageSize, locale) {
				var apipath = '/api/v2/analytics/reporting/metadata';
				var requestBody;
				var queryParameters = {};

				if (pageNumber) {
					queryParameters.pageNumber = pageNumber;
				}

				if (pageSize) {
					queryParameters.pageSize = pageSize;
				}

				if (locale) {
					queryParameters.locale = locale;
				}

				return sendRestRequest('analytics.getReportingMetadata', 'GET', apipath + '?' + $httpParamSerializerJQLike(queryParameters), requestBody);
			},

			/**
			 * @summary Get a list of report formats
			 * @description Get a list of report formats.
			 * @memberOf AnalyticsApi#
			*/
			getReportingReportformats: function () {
				var apipath = '/api/v2/analytics/reporting/reportformats';
				var requestBody;
				var queryParameters = {};

				return sendRestRequest('analytics.getReportingReportformats', 'GET', apipath + '?' + $httpParamSerializerJQLike(queryParameters), requestBody);
			},

			/**
			 * @summary Get a list of scheduled report jobs
			 * @description Get a list of scheduled report jobs.
			 * @memberOf AnalyticsApi#
			 * @param {integer} pageNumber - Page number
			 * @param {integer} pageSize - Page size
			 */
			getReportingSchedules: function (pageNumber, pageSize) {
				var apipath = '/api/v2/analytics/reporting/schedules';
				var requestBody;
				var queryParameters = {};

				if (pageNumber) {
					queryParameters.pageNumber = pageNumber;
				}

				if (pageSize) {
					queryParameters.pageSize = pageSize;
				}

				return sendRestRequest('analytics.getReportingSchedules', 'GET', apipath + '?' + $httpParamSerializerJQLike(queryParameters), requestBody);
			},

			/**
			 * @summary Create a scheduled report job
			 * @description Create a scheduled report job.
			 * @memberOf AnalyticsApi#
			 * @param {} body - ReportSchedule
			 * @example
			 * Body Example:
			 * {
					 "name": "",
					"quartzCronExpression": "",
					"nextFireTime": "",
					"dateCreated": "",
					"dateModified": "",
					"description": "",
					"timeZone": "",
					"timePeriod": "",
					"interval": "",
					"reportFormat": "",
					"locale": "",
					"enabled": true,
					"reportId": "",
					"parameters": {},
					"lastRun": {
						"name": "",
						"reportId": "",
						"runTime": "",
						"runStatus": "",
						"errorMessage": "",
						"runDurationMsec": 0,
						"reportUrl": "",
						"reportFormat": "",
						"scheduleUri": ""
					}
				}
			*/
			postReportingSchedules: function (body) {
				var apipath = '/api/v2/analytics/reporting/schedules';
				var requestBody;
				var queryParameters = {};

				if (body) {
					requestBody = body;
				}

				return sendRestRequest('analytics.postReportingSchedules', 'POST', apipath + '?' + $httpParamSerializerJQLike(queryParameters), requestBody);
			},

			/**
			 * @summary Get a scheduled report job.
			 * @memberOf AnalyticsApi#
			 * @param {string} scheduleId - Schedule ID
			 */
			getReportingSchedulesScheduleId: function (scheduleId) {
				var apipath = '/api/v2/analytics/reporting/schedules/{scheduleId}';
				var requestBody;
				var queryParameters = {};

				if (!scheduleId) {
					throw new Error('Missing required  parameter: scheduleId');
				}
				apipath = apipath.replace('{scheduleId}', scheduleId);


				return sendRestRequest('analytics.getReportingSchedulesScheduleId', 'GET', apipath + '?' + $httpParamSerializerJQLike(queryParameters), requestBody);
			},

			/**
			 * @summary Update a scheduled report job.
			 * @memberOf AnalyticsApi#
			 * @param {string} scheduleId - Schedule ID
			 * @param {} body - ReportSchedule
			 * @example
			 * Body Example:
			 * {
					 "name": "",
					"quartzCronExpression": "",
					"nextFireTime": "",
					"dateCreated": "",
					"dateModified": "",
					"description": "",
					"timeZone": "",
					"timePeriod": "",
					"interval": "",
					"reportFormat": "",
					"locale": "",
					"enabled": true,
					"reportId": "",
					"parameters": {},
					"lastRun": {
						"name": "",
						"reportId": "",
						"runTime": "",
						"runStatus": "",
						"errorMessage": "",
						"runDurationMsec": 0,
						"reportUrl": "",
						"reportFormat": "",
						"scheduleUri": ""
					}
				}
			*/
			putReportingSchedulesScheduleId: function (scheduleId, body) {
				var apipath = '/api/v2/analytics/reporting/schedules/{scheduleId}';
				var requestBody;
				var queryParameters = {};

				if (!scheduleId) {
					throw new Error('Missing required  parameter: scheduleId');
				}
				apipath = apipath.replace('{scheduleId}', scheduleId);

				if (body) {
					requestBody = body;
				}

				return sendRestRequest('analytics.getReportingSchedulesScheduleId', 'PUT', apipath + '?' + $httpParamSerializerJQLike(queryParameters), requestBody);
			},

			/**
			 * @summary Delete a scheduled report job.
			 * @memberOf AnalyticsApi#
			 * @param {string} scheduleId - Schedule ID
			 */
			deleteReportingSchedulesScheduleId: function (scheduleId) {
				var apipath = '/api/v2/analytics/reporting/schedules/{scheduleId}';
				var requestBody;
				var queryParameters = {};

				if (!scheduleId) {
					throw new Error('Missing required  parameter: scheduleId');
				}
				apipath = apipath.replace('{scheduleId}', scheduleId);

				return sendRestRequest('analytics.deleteReportingSchedulesScheduleId', 'DELETE', apipath + '?' + $httpParamSerializerJQLike(queryParameters), requestBody);
			},

			/**
			 * @summary Get list of completed scheduled report jobs.
			 * @memberOf AnalyticsApi#
			 * @param {string} scheduleId - Schedule ID
			 * @param {integer} pageNumber - 
			 * @param {integer} pageSize - 
			 */
			getReportingSchedulesScheduleIdHistory: function (scheduleId, pageNumber, pageSize) {
				var apipath = '/api/v2/analytics/reporting/schedules/{scheduleId}/history';
				var requestBody;
				var queryParameters = {};

				if (!scheduleId) {
					throw new Error('Missing required  parameter: scheduleId');
				}
				apipath = apipath.replace('{scheduleId}', scheduleId);

				if (pageNumber) {
					queryParameters.pageNumber = pageNumber;
				}

				if (pageSize) {
					queryParameters.pageSize = pageSize;
				}

				return sendRestRequest('analytics.getReportingSchedulesScheduleIdHistory', 'GET', apipath + '?' + $httpParamSerializerJQLike(queryParameters), requestBody);
			},

			/**
			 * @summary Get most recently completed scheduled report job.
			 * @memberOf AnalyticsApi#
			 * @param {string} scheduleId - Schedule ID
			 */
			getReportingSchedulesScheduleIdHistoryLatest: function (scheduleId) {
				var apipath = '/api/v2/analytics/reporting/schedules/{scheduleId}/history/latest';
				var requestBody;
				var queryParameters = {};

				if (!scheduleId) {
					throw new Error('Missing required  parameter: scheduleId');
				}
				apipath = apipath.replace('{scheduleId}', scheduleId);

				return sendRestRequest('analytics.getReportingSchedulesScheduleIdHistoryLatest', 'GET', apipath + '?' + $httpParamSerializerJQLike(queryParameters), requestBody);
			},

			/**
			 * @summary A completed scheduled report job
			 * @description A completed scheduled report job.
			 * @memberOf AnalyticsApi#
			 * @param {string} runId - Run ID
			 * @param {string} scheduleId - Schedule ID
			 */
			getReportingSchedulesScheduleIdHistoryRunId: function (runId, scheduleId) {
				var apipath = '/api/v2/analytics/reporting/schedules/{scheduleId}/history/{runId}';
				var requestBody;
				var queryParameters = {};

				if (!runId) {
					throw new Error('Missing required  parameter: runId');
				}
				apipath = apipath.replace('{runId}', runId);

				if (!scheduleId) {
					throw new Error('Missing required  parameter: scheduleId');
				}
				apipath = apipath.replace('{scheduleId}', scheduleId);

				return sendRestRequest('analytics.getReportingSchedulesScheduleIdHistoryRunId', 'GET', apipath + '?' + $httpParamSerializerJQLike(queryParameters), requestBody);
			},

			/**
			 * @summary Place a scheduled report immediately into the reporting queue
			 * @memberOf AnalyticsApi#
			 * @param {string} scheduleId - Schedule ID
			 */
			postReportingSchedulesScheduleIdRunreport: function (scheduleId) {
				var apipath = '/api/v2/analytics/reporting/schedules/{scheduleId}/runreport';
				var requestBody;
				var queryParameters = {};

				if (!scheduleId) {
					throw new Error('Missing required  parameter: scheduleId');
				}
				apipath = apipath.replace('{scheduleId}', scheduleId);

				return sendRestRequest('analytics.postReportingSchedulesScheduleIdRunreport', 'POST', apipath + '?' + $httpParamSerializerJQLike(queryParameters), requestBody);
			},

			/**
			 * @summary Get a list of report time periods.
			 * @memberOf AnalyticsApi#
			 */
			getReportingTimeperiods: function () {
				var apipath = '/api/v2/analytics/reporting/timeperiods';
				var requestBody;
				var queryParameters = {};

				return sendRestRequest('analytics.getReportingTimeperiods', 'GET', apipath + '?' + $httpParamSerializerJQLike(queryParameters), requestBody);
			},

			/**
			 * @summary Get a reporting metadata.
			 * @memberOf AnalyticsApi#
			 * @param {string} reportId - Report ID
			 * @param {string} locale - Locale
			 */
			getReportingReportIdMetadata: function (reportId, locale) {
				var apipath = '/api/v2/analytics/reporting/{reportId}/metadata';
				var requestBody;
				var queryParameters = {};

				if (!reportId) {
					throw new Error('Missing required  parameter: reportId');
				}
				apipath = apipath.replace('{reportId}', reportId);

				if (locale) {
					queryParameters.locale = locale;
				}

				return sendRestRequest('analytics.getReportingReportIdMetadata', 'GET', apipath + '?' + $httpParamSerializerJQLike(queryParameters), requestBody);
			},

			/**
			 * @summary Query for user aggregates
			 * @memberOf AnalyticsApi#
			 * @param {} body - query
			 * @example
			 * Body Example:
			 * {
					 "interval": "",
					"granularity": "",
					"groupBy": [],
					"filter": {
						"type": "",
						"clauses": [],
						"predicates": []
					},
					"metrics": [],
					"flattenMultivaluedDimensions": true
				}
			*/
			postUsersAggregatesQuery: function (body) {
				var apipath = '/api/v2/analytics/users/aggregates/query';
				var requestBody;
				var queryParameters = {};

				if (body) {
					requestBody = body;
				}

				return sendRestRequest('analytics.postUsersAggregatesQuery', 'POST', apipath + '?' + $httpParamSerializerJQLike(queryParameters), requestBody);
			},

			/**
			 * @summary Query for user observations
			 * @memberOf AnalyticsApi#
			 * @param {} body - query
			 * @example
			 * Body Example:
			 * {
					 "filter": {
						"type": "",
						"clauses": [],
						"predicates": []
					},
					"metrics": []
				}
			*/
			postUsersObservationsQuery: function (body) {
				var apipath = '/api/v2/analytics/users/observations/query';
				var requestBody;
				var queryParameters = {};

				if (body) {
					requestBody = body;
				}

				return sendRestRequest('analytics.postUsersObservationsQuery', 'POST', apipath + '?' + $httpParamSerializerJQLike(queryParameters), requestBody);
			},
		};

		this.analytics = analyticsApi;

		var languageApi = {
			/*
			* @summary Get the list of languages
			* @memberOf language#
			*/
			getLanguages: function () {
				var requestBody;
				var apipath = '/api/v2/languages';
				return sendRestRequest('language.getLanguages', 'GET', apipath, requestBody);
			},
		};

		this.language = languageApi;
	});