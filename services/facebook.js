const rp = require('request-promise');

function func(app, keys, urls, resolve, reject) {
    app.all(urls.initialize, (req, res) => {
        

        url = `https://www.facebook.com/v3.0/dialog/oauth?client_id=${keys.client_id}&redirect_uri=${req.protocol + "://" + req.headers.host + urls.callback}&response_type=code&scope=email`

        res.writeHead(303, {
            Location: url
        });
        res.end();
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
            console.log(data, photo);

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

            return resolve(details, req, res);

        } catch (err) {
            reject(err)
        }
    })

}
module.exports.func = func
