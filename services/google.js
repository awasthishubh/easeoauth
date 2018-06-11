const rp = require('request-promise');

function func(app, keys, urls) {
    app.all(urls.initialize, (req, res) => {

        url = `https://accounts.google.com/o/oauth2/auth?response_type=code&scope=https://www.googleapis.com/auth/analytics.readonly+https://www.googleapis.com/auth/userinfo.email+https://www.googleapis.com/auth/plus.login&client_id=${keys.client_id}&redirect_uri=${req.protocol + "://" + req.headers.host + urls.callback}`

        res.writeHead(303, {
            Location: url
        });
        res.end();
    })


    app.all(urls.callback, async (req, res) => {
        code = req.query.code;
        try {
            body = await rp.post({
                url: 'https://accounts.google.com/o/oauth2/token',
                json: true,
                form: {
                    client_id: keys.client_id,
                    client_secret: keys.client_secret,
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri: req.protocol + "://" + req.headers.host + urls.callback
                }
            })

            data = await rp.get({
                url: 'https://www.googleapis.com/oauth2/v2/userinfo',
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
