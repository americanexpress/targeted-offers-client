Samples for @americanexpress/targeted-offers-client
===========================

- Before executing update config.json  in samples directory with the values.

```js

{
    "rootUrl": "api.qa2s.americanexpress.com",
    "authentication": {
        "clientKey": "",
        "clientSecret": ""
    },
    "mutualAuth": {
        "privateKey": "",
        "publicCert": ""
    },
    "httpProxy": {
        "isEnabled": false,
        "host": "",
        "port": ""
    },

    "payloadEncryption": {
        "isEnabled": false,
        "publicKeyCert": ""
    }
}

```
run the following

```sh
npm install
```

- please run individual files to run the samples.


node <'sample file name'>

example : 
```sh
node authentication.js
```
