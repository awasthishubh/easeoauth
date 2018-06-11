const rp = require('request-promise');

function func(app, keys, urls) {
    app.all(urls.initialize, (req, res) => {

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
            console.log(data);

        } catch (err) {
            if (err.error) console.log(err.error);
            else console.log(err);
            return res.json({
                err: 'Invalid/Missing auth code'
            })
        }
    })
}
module.exports.func = func
