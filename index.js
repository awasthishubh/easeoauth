var serv, _keys = {},
    _urls = {}

function service(service) {
    serv = service
}

function urls(initialize,callback, post, redirect) {
    _urls = {
        callback,
        post,
        redirect,
        initialize
    }
}

function keys(client_id, client_secret) {
    _keys={client_id, client_secret}
}

function exec(app) {
    if(!(serv))
        throw Error['err']="Service not configured";
    if(!(_keys.client_id || _keys.client_secret))
        throw Error['err']="All keys not provided";
    if(!(_urls.initialize, _urls.callback, _urls.post))
        throw Error['err']="All urls not provided";
    console.log("Oauth process started");

    require('./services/twitter').func(app,_keys,_urls);
    // require('./services/facebook').func(app,_keys,_urls);
    // require('./services/google').func(app,_keys,_urls);
    // require('./services/instagram').func(app,_keys,_urls);
    // require('./services/microsoft').func(app,_keys,_urls);

}


module.exports = {
    service,
    urls,
    keys,
    exec
};
