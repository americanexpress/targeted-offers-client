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

'use strict';
let config = require('./config');
const { OffersRequestValidationError } = require('./errors');
const _ = require('./utils');

module.exports = function () {

    /**
     * Setting OAuth, Network configurations for connecting to the services
     * @param {Object} configuration configs (oAuth credentials, proxy, mutual authentication)
     */
    function configure(configuration) {
        const errors = [];
        if (_.isEmpty(configuration.rootUrl)) {
            errors.push('root URL is empty in configuration');
        }
        if (configuration.authentication && _.isEmpty(configuration.authentication.clientKey)) {
            errors.push('clienty Key is empty in configuration');
        }
        if (configuration.authentication && _.isEmpty(configuration.authentication.clientSecret)) {
            errors.push('clienty Secret is empty in configuration');
        }
        if (!_.isEmpty(errors)) {
            throw new OffersRequestValidationError(errors);
        }
        config = Object.assign(config, configuration);
    }

    /**
     * Will set bearer token in configs, which will be used for authenticating api calls
     * @param {String} token , bearer token /acces_token from Authentication response
     */
    function setBearerToken(token) {
        config.authentication.bearerToken = token;
    }
    return {
        authentication: require('./resources/authentication'),
        targetedOffers: require('./resources/offers'),
        acknowledgement: require('./resources/offers'),
        token: require('./resources/vault'),
        configure: configure,
        setBearerToken
    }
}