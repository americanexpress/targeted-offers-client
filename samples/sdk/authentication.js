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
const offersclient = require('../../index');
const fs = require('fs');
const content = fs.readFileSync("../config.json");
const config = JSON.parse(content);

/**
 * provide certificates and keys as files to the config.
 */
config.mutualAuth.privateKey = fs.readFileSync(config.mutualAuth.privateKey);
config.mutualAuth.publicCert = fs.readFileSync(config.mutualAuth.publicCert);
config.payloadEncryption.publicKeyCert = fs.readFileSync(config.payloadEncryption.publicKeyCert); //payload encryption is optional

offersclient.configure(config);


//callback support
offersclient.authentication.getBearerToken(function(err, resp) {
    if(err) {
        console.log('error: ', err)
    }
    console.log('response: ', resp);
});

//Promise support
offersclient.authentication.getBearerToken().then(resp => {
    console.log(resp)
    offersclient.setBearerToken(resp.access_token);
}).catch(e => {
    console.log(e);
})