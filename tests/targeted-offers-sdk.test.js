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
const sdk = require('../index');
const config = require('../lib/config');
const { OffersRequestValidationError } = require('../lib/errors');


beforeAll(() => {
    sdk.configure({
        rootUrl: 'test.com',
        authentication: {
            bearerToken: '',
            clientKey: 'key',
            clientSecret: 'secret'
        },
        mutualAuth: {
            privateKey: 'privateKey',
            publicCert: 'publicCert'
        },
        httpProxy: {
            isEnabled: true,
            host: 'host',
            port: 'port'
        },
        payloadEncryption: {
            isEnabled: false,
            publicKeyCert: ''
        }
    });
});


test('can instantiate sdk with configs', () => {
    expect(typeof (sdk)).toBe('object');
    expect(sdk).toHaveProperty('authentication');
    expect(sdk).toHaveProperty('targetedOffers');
    expect(sdk).toHaveProperty('acknowledgement');
    expect(sdk).toHaveProperty('token');
});

test('should be able to set bearer token in configs', () => {
    sdk.setBearerToken('token');
    expect(config.authentication).toHaveProperty('bearerToken');
    expect(config.authentication.bearerToken).toBe('token');
});

test('should throw exception if missed configs', () => {
    function configure() {
        sdk.configure({authentication: {
            bearerToken: '',
            clientKey: '',
            clientSecret: ''
        },});
    }
    expect(configure).toThrow(OffersRequestValidationError);
});
