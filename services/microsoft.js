const rp = require('request-promise');

function func(app, keys, urls, callback) {
    app.all(urls.initialize, (req, res) => {
        console.log('\x1b[36m%s\x1b[0m',"Microsoft oauth process started");
        try {
            url = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize\
        ?client_id=${keys.client_id}\
        &response_type=code\
        &scope=user.read\
        &redirect_uri=${req.protocol + "://" + req.headers.host + urls.callback}\
        &response_mode=query`

            res.writeHead(303, {
                Location: url
            });
            res.end();
        } catch (e) {
            res.status(500).json({
                err: "Something went wrong"
            })
            return callback(e)
        }
    })

    app.all(urls.callback, async (req, res) => {
        code = req.query.code;
        try {
            body = await rp.get({
                url: `https://login.microsoftonline.com/common/oauth2/v2.0/token`,
                json: true,
                form: {
                    grant_type: 'authorization_code',
                    code,
                    client_id: keys.client_id,
                    client_secret: keys.client_secret,
                    redirect_uri: req.protocol + "://" + req.headers.host + urls.callback,
                    scope: "user.read"
                }
            })
            data = await rp.get({
                url: 'https://graph.microsoft.com/v1.0/me',
                json: true,
                'auth': {
                    'bearer': body.access_token
                }
            })
            details = {
                usid: data.id,
                name: data.displayName,
                username: null,
                email: data.userPrincipalName,
                photo: null,
                provider: 'Microsoft',
                raw_dat: data
            }
            return callback(null, details, req, res);
        } catch (err) {
            return callback(err, null, req, res)

        }
    })
}
module.exports.func = func
