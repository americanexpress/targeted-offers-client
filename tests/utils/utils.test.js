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

const _ = require('../../lib/utils');
const { OffersAPIError, OffersAuthenticationError } = require('../../lib/errors');
const sdk = require('../../index');

test('should return promise', () => {
    return expect(_.callbackifyPromise(Promise.resolve('response'))).resolves.toBe('response');
});

test('should reject', () => {
    return expect(_.callbackifyPromise(Promise.reject(new OffersAPIError('error')))).rejects.toThrow(
        'error',
    );
});

test('should callback with response', () => {
    function callback(err, data) {
        expect(data).toBe('response');
    }
    _.callbackifyPromise(Promise.resolve('response'), callback);
});


test('should callback with error', () => {
    function callback(err, data) {
        expect(err).toBeInstanceOf(OffersAPIError);
    }
    _.callbackifyPromise(Promise.reject(new OffersAPIError('error')), callback);
});

test('should return true if empty', () => {
    expect(_.isEmpty('')).toBe(true);
    expect(_.isEmpty([])).toBe(true);
    expect(_.isEmpty(undefined)).toBe(true);
    expect(_.isEmpty('test')).toBe(false);
});