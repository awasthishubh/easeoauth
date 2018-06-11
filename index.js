// var serv, _keys = {},
//     _urls = {}
//
// function service(service) {
//     serv = service
// }
//
// function urls(initialize,callback, post, redirect) {
//     _urls = {
//         callback,
//         post,
//         redirect,
//         initialize
//     }
// }
//
// function keys(client_id, client_secret) {
//     _keys={client_id, client_secret}
// }

function exec(config, app) {
    if(!(config.service))
        throw Error['err']="Service not configured";
    if(!(config.keys.client_id || config.keys.client_secret))
        throw Error['err']="Keys not provided properly";
    if(!(config.urls.initialize, config.urls.callback))
        throw Error['err']="Urls not provided properly";
    config.urls.initialize.replace("\\","/");
    config.urls.callback.replace("\\","/")
    if(config.urls.initialize[0]!='/')
        config.urls.initialize ='/'+config.urls.initialize
    if(config.urls.callback[0]!='/')
        config.urls.callback ='/'+config.urls.callback
    config.service=config.service.toLowerCase()
    console.log("Oauth process started");

    supported=["facebook","instagram", "twitter", "google", "microsoft"]

    if(supported.indexOf(config.service)==-1)
        throw Error['err']="Service not supported";

    require('./services/'+config.service).func(app,config.keys,config.urls);

}


module.exports = {
    exec
};
