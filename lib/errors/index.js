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

/**
 * OffersError is the base for other specific errors from Offers API
 */
class OffersError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    // to have the stacktrace look nicer
    Error.captureStackTrace(this, this.constructor);
  }
}


/**
 * OffersAuthentiationError is raised when invalid API Key or Secret is 
 * sent to the API
 */
class OffersAuthenticationError extends OffersError { }

/**
 * OffersRequestValidationError is raised when the request is not valid 
 */
class OffersRequestValidationError extends OffersError {
  constructor(fields) {
    super('request validation failed');
    this.fields = fields || {};
  }
}

/**
 * NocertificateWasSentError is raised when no certificates were sent while
 * making the API call for Mutual authentication
 */
class NoCertificateWasSentError extends OffersError { }

/**
 * NoOffersAvailable will be raised when the user is not qualified for a 
 * PreQual or PreScreened Offers
 */
class NoOffersAvailable extends OffersError { }

/**
 * OffersAPIError is a generic type of error, It will be raised when there is 
 * an Internal server error or any other error which is not covered by any of 
 * the named errors.
 */
class OffersAPIError extends OffersError { }

/**
 * PayloadEncryptionError is a generic type of error for Encryption errors, 
 * It will be raised when there is an Exception raised at the Payload encryption
 */
class PayloadEncryptionError extends OffersError { }


module.exports = {
  OffersAuthenticationError,
  OffersRequestValidationError,
  NoCertificateWasSentError,
  NoOffersAvailable,
  OffersAPIError,
  PayloadEncryptionError,
  OffersError
};