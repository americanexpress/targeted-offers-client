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

const validations = require('../../lib/utils/validations');
const { OffersRequestValidationError } = require('../../lib/errors');


test('should retrun empty array if no validation errors', () => {
    expect(validations.validateHeaders('request', {
        user_consent_status: true,
        user_consent_timestamp: 53535325,
        message_type_id: 1101,
        request_id: 'dfsfsdfs',
        client_id: 'ASDFSD334235DDD'
    })).toMatchObject([]);
});


test('should return Array of errors', () => {
    expect(validations.validateHeaders('', {})).toMatchObject([
        'request id is missing in headers',
        'client id is missing in headers',
        'request is empty'
    ]);
});


test('should return Array of errors', () => {
    expect(validations.validateHeaders()).toMatchObject([
        'headers is empty',
        'request is empty'
    ]);
});
