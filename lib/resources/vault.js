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
const { OffersRequestValidationError } = require('../errors');
const validations = require('../utils/validations');
const _ = require('../utils');

/***
 * implementation for getting session token from American Express
 * 
 * @param {String} [requestTrackingId] - required - to be the applicant_request_tracking_id in the Offers response
 * @param {Object} [headerParams] - required - Params required to call the serivice.
 * The accepted parameters are : 
 *     - message_type_id - will be shared by amex
 *     - request_id - same request_id that was passed in offers api
 *     - client_id - client Id provided by Amex different from the client Id configured in config
 * @param {function} [callback] - optional for call back support
 */
function getSessionToken(requestTrackingId, headerParams, callback) {
    const errors = validations.validateHeaders(requestTrackingId, headerParams);

    if (!_.isEmpty(errors)) {
        return _.callbackifyPromise(Promise.reject(new OffersRequestValidationError(errors)), callback);
    }
    const body = {
        'token_id': requestTrackingId
    }

    return _.callbackifyPromise(httpclient.callService('/acquisition/digital/v1/token_mgmt/tokens', 'POST', _.createHeaders(headerParams), JSON.stringify(body)), callback);
}
module.exports = {
    getSessionToken
}