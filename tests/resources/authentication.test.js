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
const sdk = require('../../index');
const httpclient = require('../../lib/client/http-client');
const { OffersRequestValidationError } = require('../../lib/errors');

jest.mock('../../lib/client/http-client');
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


test('should return access token', () => {
    httpclient.callService.mockReturnValueOnce(Promise.resolve({
        scope: 'default',
        status: 'approved',
        expires_in: '3599',
        token_type: 'BearerToken',
        access_token: 'access token mock'
    }));

    return sdk.authentication.getBearerToken().then(resp => {
        expect(resp.access_token).toBe('access token mock');
        expect(httpclient.callService).toHaveBeenCalledTimes(1);
        expect(httpclient.callService.mock.calls[0][0]).toBe('/apiplatform/v1/oauth/token_provisioning/bearer_tokens');
        expect(httpclient.callService.mock.calls[0][1]).toBe('POST');
        const headers = httpclient.callService.mock.calls[0][2];
        expect(headers['X-AMEX-API-KEY']).toBe('key');
        expect(headers['Authorization']).toBe('Basic a2V5OnNlY3JldA==');
        expect(headers['content-type']).toBe('application/x-www-form-urlencoded');
    });
});

test('should return validation exception', () => {
    function getBearerToken() {
        httpclient.callService.mockImplementation(() => {
            throw new OffersRequestValidationError()
        });
        return sdk.authentication.getBearerToken();
    }
    expect(getBearerToken).toThrow(OffersRequestValidationError);
});