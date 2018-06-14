# Easeoauth

A package to ease the process of oauth authentication using various oauth providers with just a few lines of codes. It returns the very basic information about the authenticated user that oauth provider provides.

## Contents
* [Installing](#installing)
* [Supported Services](#supported-services)
* [Permissions](#permissions)
* [How to use?](#how-to-use)
* [Explaination](#explaination)
* [Returned Data](#returned-data)


--------------------------------



## Installing

Easeoauth has request module as its dependency which will be installed automatically along with the module.

```
$ npm install easeoauth
```

## Supported Services

Easeoauth currently supports ``Twitter`` ```Facebook``` ```Google``` ``Instagram`` and ```Microsoft``` oauth services.

Other services will be added on requests

## Permissions

Easeoauth requires very basic permissions. These permissions must be available to you by default

>Facebook: email

>Google: plus.me+userinfo.email

>Twitter: Read-only

>Instagram: basic

>Microsoft: user.read

**NOTE**
- Instagram apps run in sandbox by default. U need to submit your app for review and to get permissions.

## How to use?

Run the exec function from easeoauth module with the required parameters

```Javascript
const oauth = require('easeoauth');

oauth.exec(app, config, function(err, data, req, res) {
    if(err)
        return console.log(err); //error occurred during setup
    if(err && res){ //error occurred at callback route
      console.log(err)
      return res.send({err: "Something went wrong")
    }
    res.send(data)
})

```
**Note:**
* error may contain your secrete key. Handle it carefully.

## Explaination

### App

This is the express app object that will be used to create *initial* and *callback* routes
```Javascript
const express = require('express')
const app= express();
```
### Config

Its a js object that contains the required keys and urls for the oauth process

**Example:**
```Javascript
config={
    service: "instagram", // or "microsoft" , "facebook", "instagram", "twitter"
    keys: {
        client_id: "142c703xxxxxxxxxa8e204",
        client_secret: "a34e9xxxxxxxxxxaa82"
    },
    urls: {
        initialize: "/instagram",
        callback: "/instagram/callback"
    }
}
```
- **service:** It specifies the oauth service u would like to use. It needs to be one of the [Supported Services](#supported-services)

- **keys.client_id:** It is the client id of your app. You will get that from your app settings.

- **keys.client_secret:** It is the client secrete of your app. You will get that from your app settings.

- **urls.initialize:** It is the the url relative to your host from where the oauth process will start. You need to send your user to this page to start the oauth process. From here user will be redirected to oauth service provider's authentication page.

- **urls.callback:** It is the callback url relative to your host where the oauth provider will redirect user after successfull authentiaction.

**Note:**

* Absolute callback url must be registered at you app settings. For the above example, if I am running it on my localhost then http://localhost/instagram/callback must be registered as Valid redirect URIs on my apps settings
- Facebook requires https by default. So you must be running your app on https to use facebook oauth

### Callback funtion

Callback function has three parameters and it will be called by .exec function on completion of oauth process or if it encounters some error

- **err**: It contains the error if encountered by oauth flow. It's value will be ```null``` on successfull completion of oauth flow

- **data**: It is the data that is returned by oauth provider. See [Returned data](#object) for more info.

- **req, res**: These are the request and response objects of callback route where the oauth process terminates.

**NOTE**
- if error occurred during setup process, ```data```, ```res``` and ```req``` will be set to ```null```
- If error occurred at callback route, ```data``` will be set to ```null``` and ```res```,```req``` will be *response* and *request* objects of callback route.
- In the above example, On successfull completion ```res.send(data)``` will show the users detail on http://localhost/instagram/callback route

## Returned Data

The data returned by oauth provider can by assessed as 3rd parameter of callback function

**Syntax**
```javascript
{
  "usid": "unique id of user assigned by oauth provider",
  "name": "Name of authenticated user",
  "username": "Username of authenticated user (if any)",
  "email": "Email of user (If registered and allowed by oauth provider)",
  "photo": "Link to user's Display Picture",
  "provider": "Oauth provider",
  "raw_dat": { "Contains data as received from oauth provider" }
}

```

The basic purpose of this app is authentication and thus it provide minimal info about user. Rest info can be assessd from ```raw_dat```
