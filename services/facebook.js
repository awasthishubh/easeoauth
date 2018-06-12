const rp = require('request-promise');

function func(app, keys, urls, callback) {
    app.all(urls.initialize, (req, res) => {
        console.log('\x1b[36m%s\x1b[0m', "Facebook oauth process started");
        try {
            url = `https://www.facebook.com/v3.0/dialog/oauth?client_id=${keys.client_id}&redirect_uri=${req.protocol + "://" + req.headers.host + urls.callback}&response_type=code&scope=email`

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
                url: `https://graph.facebook.com/v2.10/oauth/access_token?client_id=${keys.client_id}&redirect_uri=${req.protocol + "://" + req.headers.host + urls.callback}&client_secret=${keys.client_secret}&code=${code}`,
                json: true
            })

            data = await rp.get({
                url: 'https://graph.facebook.com/me?access_token=' + body.access_token + '&fields=id,name,email',
                json: true,
            })

            photo = await rp.get({
                url: 'https://graph.facebook.com/v3.0/me/picture?access_token=' + body.access_token + '&format=json&redirect=false&type=large&height=1000',
                json: true,
            })

            details = {
                usid: data.id,
                name: data.name,
                email: data.email,
                photo: photo.data.url,
                provider: 'Facebook',
                raw_dat: {
                    data,
                    photo
                }
            }

            return callback(null, details, req, res);

        } catch (err) {
            return callback(err, null, req, res);
        }
    })

}
module.exports.func = func
