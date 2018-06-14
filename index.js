function exec(app, config, callback) {
    try{
        if (!(config.service))
            throw Error("Service not configured");
        if (!(config.keys.client_id || config.keys.client_secret))
            throw Error("Keys not provided properly");
        if (!(config.urls.initialize, config.urls.callback))
            throw Error("Urls not provided properly");
        config.urls.initialize.replace("\\", "/");
        config.urls.callback.replace("\\", "/")

        if (config.urls.initialize[0] === '.') config.urls.callback = config.urls.initialize.slice(1)
        if (config.urls.callback[0] == '.') config.urls.callback = config.urls.callback.slice(1)
        if (config.urls.initialize[0] != '/')
            config.urls.initialize = '/' + config.urls.initialize
        if (config.urls.callback[0] != '/')
            config.urls.callback = '/' + config.urls.callback
        config.service = config.service.toLowerCase()

        supported = ["facebook", "instagram", "twitter", "google", "microsoft"]

        if (supported.indexOf(config.service) == -1)
            throw Error("Service not supported");

        require('./services/' + config.service).func(app, config.keys, config.urls, callback);
    } catch(e){
        return callback(e)
    }
}


module.exports = {
    exec
};
