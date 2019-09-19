'use strict';

let config = exports = {
    rootUrl: '',
    authentication: {
        bearerToken: '',
        clientKey: '',
        clientSecret: ''
    },
    mutualAuth: {
        privateKey: '',
        publicCert: ''
    },
    httpProxy: {
        isEnabled: false,
        host: '',
        port: ''
    },
    payloadEncryption: {
        isEnabled: false,
        publicKeyCert: ''
    }
}