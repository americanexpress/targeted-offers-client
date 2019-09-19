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
const jose = require('node-jose');
const httpclient = require('../../lib/client/http-client');
const { OffersRequestValidationError, PayloadEncryptionError } = require('../../lib/errors');



jest.mock('../../lib/client/http-client');
jest.mock('node-jose');


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


beforeEach(() => {
    jest.clearAllMocks();
});

test('can instantiate sdk with configs', () => {
    expect(typeof (sdk)).toBe('object');
    expect(sdk).toHaveProperty('authentication');
    expect(sdk).toHaveProperty('targetedOffers');
    expect(sdk).toHaveProperty('acknowledgement');
    expect(sdk).toHaveProperty('token');
});


const headerParams = {
    user_consent_status: true,
    user_consent_timestamp: 53535325,
    message_type_id: 1101,
    request_id: 'dfsfsdfs',
    client_id: 'ASDFSD334235DDD'
};


const request = {
    applicants: [{
        type: "basic",
        personal_info: {
            names: [{
                title: "Mr",
                first: "DeltaTargeted"
            }]
        }
    }]
};

const response = {
    applicant_request_tracking_id: 'dummy',
    offers: [
        {
            offer_txn_id: 'dummytxn',
            acquisition_offer_id: 'dummy_offer',
            product_code: 'dummy_prdo',
        }
    ],
    applicant_request_token: 'dummy_token',
    applicant_request_token_expires_in: '7200000',
    customer_flag: 'PROSPECT',
    line_of_business: 'CONSUMER'
};



test('should return offers', () => {
    httpclient.callService.mockReturnValueOnce(Promise.resolve(response));
    return sdk.targetedOffers.get(request, headerParams).then(resp => {
        expect(resp).toBe(response);
        expect(httpclient.callService).toHaveBeenCalledTimes(1);
        expect(httpclient.callService.mock.calls[0][0]).toBe('/acquisition/digital/v1/offers/cards/targeted_offers');
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


test('should be able to acknowledge', () => {
    httpclient.callService.mockReturnValueOnce(Promise.resolve(true));
    return sdk.targetedOffers.acknowledge('requestid', headerParams).then(resp => {
        expect(resp).toBe(true);
        expect(httpclient.callService).toHaveBeenCalledTimes(1);
        expect(httpclient.callService.mock.calls[0][0]).toBe('/acquisition/digital/v1/offers/cards/targeted_offers_acknowledgment');
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


test('should return validation exception', () => {
    function acknowledge() {
        httpclient.callService.mockImplementation(() => {
            throw new OffersRequestValidationError()
        });
        return sdk.targetedOffers.acknowledge('requestid', headerParams);
    }
    expect(acknowledge).toThrow(OffersRequestValidationError);
});

test('should return validation exception if headers are empty', () => {
    expect(sdk.targetedOffers.acknowledge('requestid', {
        user_consent_status: true,
        user_consent_timestamp: '',
        message_type_id: 1101,
        request_id: '',
        client_id: ''
    })).rejects.toEqual(new OffersRequestValidationError());
});


test('should return validation exception if headers are empty', () => {
    expect(sdk.targetedOffers.get(request, {})).rejects.toEqual(new OffersRequestValidationError());
});



test('should return payload Encryption error if encryption fails', () => {

    sdk.configure({
        rootUrl: 'https://test.com',
        authentication: {
            bearerToken: 'token',
            clientKey: 'key',
            clientSecret: 'secret'
        },
        payloadEncryption: {
            isEnabled: true,
            publicKeyCert: 'fsdsd'
        }
    });
    jose.JWK.createKeyStore.mockImplementation(() => {
        return {
            add: () => {
                return Promise.resolve('key');
            }
        };
    });
    jose.JWE.createEncrypt.mockImplementation(() => {
        throw Error('error');
    });
    expect(sdk.targetedOffers.get(request, headerParams)).rejects.toEqual(new PayloadEncryptionError("Error: error"));

});


test('should return success response', () => {
    sdk.configure({
        rootUrl: 'test.com',
        authentication: {
            bearerToken: 'token',
            clientKey: 'key',
            clientSecret: 'secret'
        },
        payloadEncryption: {
            isEnabled: true,
            publicKeyCert: 'fsdsd'
        }
    });
    jose.JWK.createKeyStore.mockImplementation(() => {
        return {
            add: () => {
                return Promise.resolve('key');
            }
        };
    });
    jose.JWE.createEncrypt.mockImplementation(() => {
        return {
            update: () => {
                return {
                    final: () => {
                        return "encrypted text";
                    }
                }
            }
        }
    });
    httpclient.callService.mockReturnValueOnce(Promise.resolve(response));
    return sdk.targetedOffers.get(request, headerParams).then(resp => {
        expect(resp).toBe(response);
    });
});