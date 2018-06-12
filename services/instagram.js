const rp = require('request-promise');

function func(app, keys, urls, callback) {
    app.all(urls.initialize, (req, res) => {

        url = `https://www.instagram.com/oauth/authorize/?client_id=${keys.client_id}&redirect_uri=${req.protocol+"://"+req.headers.host+ urls.callback}&response_type=code`

        res.writeHead(303, {
            Location: url
        });
        res.end();
    })

    app.all(urls.callback, async (req, res) => {
        code = req.query.code;
        try {
            body = await rp.post({
                url: `https://api.instagram.com/oauth/access_token`,
                json: true,
                form: {
                    client_id: keys.client_id,
                    client_secret: keys.client_secret,
                    grant_type: 'authorization_code',
                    redirect_uri: req.protocol + "://" + req.headers.host + urls.callback,
                    code
                }
            })

            data = await rp.get({
                url: `https://api.instagram.com/v1/users/self/?access_token=${body.access_token}`,
                json: true
            })

            details = {
                usid: data.data.id,
                name: data.data.full_name,
                username: data.data.username,
                email: null,
                photo: data.data.profile_picture,
                provider: 'Instagram',
                raw_dat: {
                    data
                }
            }
            return callback(null, details, req, res);
        } catch (err) {
            return callback(err, null, req, res)
        }
    })
}

module.exports.func = func
