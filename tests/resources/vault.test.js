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
            bearerToken: 'token',
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

const headerParams = {
    user_consent_status: true,
    user_consent_timestamp: 53535325,
    message_type_id: 1101,
    request_id: 'dfsfsdfs',
    client_id: 'ASDFSD334235DDD'
};


test('should return session token', () => {
    httpclient.callService.mockReturnValueOnce(Promise.resolve({
        acquisition_web_token: 'fldsjflsdfj3k3jlk34j'
    }));

    return sdk.token.getSessionToken('djkladf', headerParams).then(resp => {
        expect(resp.acquisition_web_token).toBe('fldsjflsdfj3k3jlk34j');
        expect(httpclient.callService).toHaveBeenCalledTimes(1);
        expect(httpclient.callService.mock.calls[0][0]).toBe('/acquisition/digital/v1/token_mgmt/tokens');
        expect(httpclient.callService.mock.calls[0][1]).toBe('POST');
        const headers = httpclient.callService.mock.calls[0][2];
        expect(headers['X-AMEX-API-KEY']).toBe('key');
        expect(headers['Authorization']).toBe('Bearer token');
        expect(headers['content-type']).toBe('application/json');
        expect(headers['user_consent_status']).toBe(true);
        expect(headers['message_type_id']).toBe(1101);
        expect(headers['request_id']).toBe('dfsfsdfs');
    });
});



test('should return validation exception from ', () => {
    function getToken() {
        httpclient.callService.mockImplementation(() => {
            throw new OffersRequestValidationError()
        });
        return sdk.token.getSessionToken('sdfsdfs', headerParams);
    }
    expect(getToken).toThrow(OffersRequestValidationError);
});



test('should return validation exception', () => {
    return expect(sdk.token.getSessionToken('', headerParams)).rejects.toThrow(
        OffersRequestValidationError
    );
});
