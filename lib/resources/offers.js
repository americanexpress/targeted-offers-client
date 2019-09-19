/*
 * Copyright 2019 American Express Travel Related Services Company, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */
"use strict";
const httpclient = require('../client/http-client');
const jose = require('node-jose');
const _ = require('../utils');
const validations = require('../utils/validations');
const config = require('../config');
const { PayloadEncryptionError, OffersRequestValidationError, OffersError } = require('../errors');


/**
 * Implementation for getting offers from American Express
 * @param {Object} body - required - as per the contract 
 * @param {Object} headerParams  - required - Params required to call the serivice.
 * The accepted parameters are :
 *		- user_consent_status 	- boolean status of user consent
 * 		- user_consent_timestamp  - timestamp when user consented to show offer
 *     	- message_type_id - will be shared by amex
 *     	- request_id - unique id for tracking
 * 		- client_id - client Id provided by Amex different from the client Id configured in config
 * 		- bearer_token - bearer token from the Authentication call 
 * @param {function} callback - optional - for callback support
 */
function get(body, headerParams, callback) {
	const errors = validations.validateHeaders(body, headerParams);
	if (!_.isEmpty(errors)) {
		return _.callbackifyPromise(Promise.reject(new OffersRequestValidationError(errors)), callback);
	}
	if (config.payloadEncryption.isEnabled) {
		const bufferedRequest = Buffer.from(JSON.stringify(body));
		let keystore = jose.JWK.createKeyStore();
		return keystore.add(config.payloadEncryption.publicKeyCert, 'pem').then(key => {
			return jose.JWE.createEncrypt({ format: 'compact' }, key).update(bufferedRequest).final()
		}).catch(e => {
			return _.callbackifyPromise(Promise.reject(new PayloadEncryptionError(e)), callback);
		}).then(encrypted => {
			return _.callbackifyPromise(httpclient.callService('/acquisition/digital/v1/offers/cards/targeted_offers', 'POST', _.createHeaders(headerParams), JSON.stringify({
				'user_info': encrypted
			})), callback);

		});
	}
	else {
		return _.callbackifyPromise(httpclient.callService('/acquisition/digital/v1/offers/cards/targeted_offers', 'POST', _.createHeaders(headerParams), JSON.stringify(body)), callback);
	}
}


/***
 * Acknowledging offers
 * @param {Object} [requestTrackingId] - required - from the offer service response
 * @param {Object} [headerParams] - required - Params required to call the serivice.
 * accepted parameters are :
 *     	- message_type_id - will be shared by amex
 *     	- request_id - same request_id that was passed in offers api
 *    	- client_id - client Id provided by Amex different from the client Id configured in config
 * @param {function} callback - optional - for callback support
 */

function acknowledge(requestTrackingId, headerParams, callback) {
	const errors = validations.validateHeaders(requestTrackingId, headerParams);

	if (!_.isEmpty(errors)) {
		return _.callbackifyPromise(Promise.reject(new OffersRequestValidationError(errors)), callback);
	}
	const body = {
		'applicant_request_tracking_id': requestTrackingId
	}
	return _.callbackifyPromise(httpclient.callService('/acquisition/digital/v1/offers/cards/targeted_offers_acknowledgment', 'POST', _.createHeaders(headerParams), JSON.stringify(body)), callback);
}

module.exports = {
	get,
	acknowledge
}