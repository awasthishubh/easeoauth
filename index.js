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
    console.log("running");
}


module.exports = {
    service,
    urls,
    keys,
    exec
};
