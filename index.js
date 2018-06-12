function exec(config, app, callback) {
    if (!(config.service))
        return callback("Service not configured");
    if (!(config.keys.client_id || config.keys.client_secret))
        return callback("Keys not provided properly");
    if (!(config.urls.initialize, config.urls.callback))
        return callback("Urls not provided properly");
    config.urls.initialize.replace("\\", "/");
    config.urls.callback.replace("\\", "/")
    console.log(config.urls.callback);

    if(config.urls.initialize[0] === '.') config.urls.callback=config.urls.initialize.slice(1)
    if(config.urls.callback[0] == '.') config.urls.callback=config.urls.callback.slice(1)
    if (config.urls.initialize[0] != '/')
        config.urls.initialize = '/' + config.urls.initialize
    if (config.urls.callback[0] != '/')
        config.urls.callback = '/' + config.urls.callback
    console.log(config.urls.callback);
    config.service = config.service.toLowerCase()
    console.log("Oauth process started");

    supported = ["facebook", "instagram", "twitter", "google", "microsoft"]

    if (supported.indexOf(config.service) == -1)
        return callback("Service not supported");

    require('./services/' + config.service).func(app, config.keys, config.urls, callback);
}


module.exports = {exec};
