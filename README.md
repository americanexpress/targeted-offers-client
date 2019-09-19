# Targeted Offers Node SDK
Amex Targeted Offers API is a capability to request instant pre-qualified , prescreened  Card offer(s) for the applicants, if eligible. 
Targeted Offers API provides an interface to interact with systems of American Express. 
​
</br></br>This JavaScript implementation allows Amex partners to integrate seamlessly to Targeted Offers and reduces complexity out of coding service layer integration to Targeted Offers API. The Targeted Offers Node SDK is a simple wrapper to the API. It assumes you have already set up your credentials with American Express and have your certs prepared. See the [authorization and authentication guides](https://developer.americanexpress.com/products/amex-pre-qualification-v3/guide#authentication) for more information. 
</br></br>

## Table of Contents

- [Documentation](#documentation)    
- [Installation](#installation)
- [Compatibility](#compatibility)
- [Configuration](#configuring-sdk)
- [Authentication](#authentication)
- [Business Functions](#business-functions)
    - [Offers](#offers)
        - [Getting offers](#getting-offers)
        - [Acknowleding Offers](#acknowledging-offers)
    - [Token](#token)
- [Error Handling](#error-handling)
- [Samples](#Running-Samples)
- [Open Source Contribution](#Contributing)
- [License](#license)
- [Code of Conduct](#code-of-conduct)


<br/>

## Documentation

Please see : [documentation for Amex Pre-Qualification API](https://developer.americanexpress.com/products/amex-pre-qualification-v3)

<br/>

## Installation

```sh
	npm install @americanexpress/targeted-offers-client
```
<br/>

## Compatibility

targeted-offers-client sdk will support Node Version 6 or higher and NPM version 3.8.6 or higher.

- On newer version of Node you can use `async/await` instead of promises (all the below examples in the sdk will be using Promises)
- On older version of Node you can use either callbacks or promises, all the SDK functions will have an optional parameter to support call back.

Sample for call back support :

```js
var offersclient = require(@americanexpress/targeted-offers-client);
var config = {}
offersclient.configure(config);

offersclieknt.targetedoffers.get(request, headers, function (err, response) {
    if(err) {
        //handle error
    }
    else {
        //display offers
    }
})


```


<br/>

## Configuring SDK

SDK needs to be configured with OAuth, Mutual Auth and Payload encryption configurations. below is the sample configuration snippet.

```js
const fs = require('fs');
const offersclient = require(@americanexpress/targeted-offers-client);
const config = {
    //-- required, based on the environment(test, production) it will change, Amex will provide the root URls
    rootUrl: 'api.qa2s.americanexpress.com', 
    /**
     *OAuth configuration  
     */
    authentication: {
        //optional -- if you have an active bearerToken, you can set this property and skip authentication call.
        bearerToken: '',
        //--required, OAuth key, will be provided by American Express.
        clientKey: '',
        //--required, OAuth Secret, will be provided by American Express.
        clientSecret: ''
    },
    /**
     * 2-way SSL(Mutual Auth) configuration
     */
    mutualAuth: {
        //--required, Client needs to provide file  private key file in .pem format
        privateKey: fs.readFileSync(''),
        // --required, Client needs to provide their public key file
        publicCert: fs.readFileSync('') 
    },
    /**
     * Support for calling APIs over internet 
     */
    httpProxy: {
        //false, if it is not needed.
        isEnabled: false, 
        // host, can support both http and https 
        host: '',
        // port, port number for the proxy 
        port: '' 
    },
    /**
     * JWE encryption
     */
    payloadEncryption: {
        //true, if needed.
        isEnabled: false, 
        //required if payload Encryption is enabled, publicKey.pem file will be provided by American Express 
        publicKeyCert: fs.readFileSync('')
    }
}

offersclient.configure(config);

```

<br/>

## Authentication

Amex Targeted Offers API uses token based authentication. The following examples demonstrates how to genereate bearer tokens using the SDK

```js
offersclient.authentication.getBearerToken().then(resp => {
    //success response
    offersclient.setBearerToken(resp.access_token); //set the bearertoken for further api calls 
})

```
Sample Resposne : 

```js
{
  scope: 'default',
  status: 'approved',
  expires_in: '3599', // token expirty in seconds, you can cache the token for the amount of time specified.
  token_type: 'BearerToken',
  access_token: 'wJeW9CPT0DbrqBjrTN1xbMQZkae2'
}

```
Note : you can skip this call if you have an active Token in your cache. if you have an active token, you can just set the bearerToken in config under authentication or call `setBearerToken('access_token')` method to update the config.



<br/>

## Getting Offers

Request body and API mandatory fields can be found at [API Specifications](https://developer.americanexpress.com/products/amex-pre-qualification-v3/resources#post-targeted_offers).

```js
const headers = {
    user_consent_status: true,
    user_consent_timestamp: new Date(),
    message_type_id: 1101, // value will be provided by Amex
    request_id: '', //unique Id
    client_id: 'ASDFSD334235DDD' // Unique client id will be provided by Amex,
}

const request = {
    //see samples for a sample body
}

return offersclient.targetedoffers.get(request, headers).then(resp => {
    //successful response
});

```

This will return an array of offers, you can find more information on response at [reference guide](https://developer.americanexpress.com/products/amex-pre-qualification-v3/resources#post-targeted_offers).

<br/>

## Acknowledging Offers
The `acknowledge()` method is used to let American Express know that offers were presented to the user. Response will be true if the API call is success.

```js
//applicant_request_tracking_id will be provided as part of the targeted offers response.
return offersclient.targetedoffers.acknowledge(applicant_request_tracking_id, headers).then(resp => {
    //successful response
});

```


<br/>

## Token
The `getSessionToken()` method is used to get a session token. Session Token is required to maintain the session of the user and is only of one time use.

```js
const headers = {
    message_type_id: 1101, // value will be provided by Amex
    request_id: '', //unique Id
    client_id: 'ASDFSD334235DDD' //provided by Amex
}
 //applicant_request_tracking_id will be provided as part of the targeted offers response. please pass the value to get session token.
return offersclient.token.getSessionToken(applicant_request_tracking_id, headers).then(resp => {
    //successful response
});

```
Sample Success response: 

```js
{
  acquisition_web_token: 'eyJhbGciOiJSUzI1NiJ9.eyJjbGFpbXNfcmVxIjoidHJ1ZSIsImFjY2Vzc190eXBlIjoiUyIsInRva2VuX2lkIjoi'
}
```

<br/>

## Error Handling

In case of exceptions encountered while calling American Express APIs, SDK will throw Errors. For example if all the required fields are not sent, SDK will throw an error object with name `OffersRequestValidationError`. 

if callback function is provided, error will be sent back as the first argument of the callback function.

```js 
offersclient.targetedoffers.get(request, headers, function (err, result) {
    if(err){
        // handle exception
    }
});
```
if callback function is not provided, SDK will reject Promise

```js

offersclient.targetedoffers.get(request, headers).then(res => {
//success 
}).catch(err => {
    err.name // err.name will give the name of error thrown -- example: OffersAuthenticationError
    //handle exception 
});

```

Possible exceptions : 
```js
- OffersAuthenticationError // Authentication errors with the API -- example : invalid API Key or Secret is sent to the API

- OffersRequestValidationError // Request Validation Error -- request or configs provided to the SDK are invalid, you can see more info in err.fields for the fields that failed validations.

- NoOffersAvailable //NoOffersAvailable will be raised when the user is not qualified for a PreQual or PreScreened Offers. 

- OffersAPIError // is a generic type of error, It will be raised when there is an Internal server error or any other error which is not covered by any of the named errors.

- PayloadEncryptionError // PayloadEncryptionError is a generic type of error for Encryption errors,It will be raised when there is an Exception raised at the Payload encryption. More information will be present in the error message.

```

<br/>

## Running Samples 
Instructions for Running Samplease are in the [sample directory](/samples).

<br/>

## Contributing

We welcome Your interest in the American Express Open Source Community on Github. Any Contributor to
any Open Source Project managed by the American Express Open Source Community must accept and sign
an Agreement indicating agreement to the terms below. Except for the rights granted in this 
Agreement to American Express and to recipients of software distributed by American Express, You
reserve all right, title, and interest, if any, in and to Your Contributions. Please
[fill out the Agreement](https://cla-assistant.io/americanexpress/targeted-offers-client).

<br/>

## License

Any contributions made under this project will be governed by the
[Apache License 2.0](./LICENSE.txt).


<br/>

## Code of Conduct

This project adheres to the [American Express Community Guidelines](./CODE_OF_CONDUCT.md). By
participating, you are expected to honor these guidelines.