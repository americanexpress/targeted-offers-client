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
const fs = require('fs');
const uuidv1 = require('uuid/v1');
const _ = require('lodash');

const content = fs.readFileSync("../config.json");
const config = JSON.parse(content);


/**
 * provide certificates/key files to the config.
 */
config.mutualAuth.privateKey = fs.readFileSync(config.mutualAuth.privateKey);
config.mutualAuth.publicCert = fs.readFileSync(config.mutualAuth.publicCert);
if(config.payloadEncryption.isEnabled){
    config.payloadEncryption.publicKeyCert = fs.readFileSync(config.payloadEncryption.publicKeyCert);
}

const sdk = require('../../index');
sdk.configure(config);
const request = {
    applicants: [{
        type: "basic",
        personal_info: {
            names: [{
                title: "Mr",
                first: "DeltaTargeted",
                last: "Doe",
                middle: "BOB",
                language: "en"
            }],
            phones: [{
                type: "H",
                country_code: "44",
                number: "2343323432"
            }],
            addresses: [{
                type: "H",
                line1: "TO Treatment St",
                line2: "2",
                region: "New York",
                postal_code: "10025",
                city: "New York",
                country: "US",
                language: "en"
            }],
            emails: [{
                email: "test@example.org"
            }]
        },
        business_owner: "NO"
    }],
    partner: {
        partner_name: "DELTA",
        account_tenure_date: "19650701"
    },
    transaction_cost: {
        currency: "USD",
        amount: "3000"
    },
    line_of_business: "CONSUMER"
};

const headers = {
    user_consent_status: true,
    user_consent_timestamp: Date.now(),
    message_type_id: 1101,
    request_id: uuidv1(),
    client_id: 'ASDFSD334235DDD' //client Id provided by Amex, not the client id used for authentication
}

sdk.authentication.getBearerToken().then(resp => {
    console.log('OAuth Token Response: ', resp)
    if (resp.access_token) {
        sdk.setBearerToken(resp.access_token); // set access_token, you can cache this token until the expiry time provided in response
        return sdk.targetedOffers.get(request, headers);
    }
}).then(response => {
    console.log('Response: ', response);
    if (response.applicant_request_tracking_id) {
        return sdk.targetedOffers.acknowledge(response.applicant_request_tracking_id, headers);
    }
}).then(ackResponse => {
    console.log('acknowledgement Response: ', ackResponse);
}).catch(e => {
    console.log('Error : ', e);
});
