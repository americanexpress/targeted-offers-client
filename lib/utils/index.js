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

const config = require('../config');
const { OffersAuthenticationError } = require('../errors');

/**
 * create Headers for making http calls.
 * @param {Object} headerParams 
 */
function createHeaders(headerParams) {
    let headers = {
        'X-AMEX-API-KEY': config.authentication.clientKey,
        Authorization: `Bearer ${config.authentication.bearerToken}`,
        'content-type': 'application/json',
    }
    return Object.assign(headers, headerParams); s
}


/**
 * Function to support both promises and call back
 * @param {Promise} promise - returns Promise
 * @param {function} callback - function to callback
 */
function callbackifyPromise(promise, callback) {
    if (callback) {
        return promise.then(
            (res) => {
                callback(null, res);
            },
            (err) => {
                callback(err, null);
            }
        );
    }
    return promise;
}

function isEmpty(obj) {
    if (obj == null) return true;
    if (Array.isArray(obj) || typeof (obj) === 'string') return obj.length === 0;
}

module.exports = {
    createHeaders,
    callbackifyPromise,
    isEmpty
}