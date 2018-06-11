const rp = require('request-promise');

function func(app, keys, urls) {
    app.all(urls.initialize, async (req, res) => {
        body = await rp.post({
            url: 'https://api.twitter.com/oauth/request_token',
            json: true,
            'oauth': {
                callback: req.protocol + "://" + req.headers.host + urls.callback,
                consumer_key: keys.client_id,
                consumer_secret: keys.client_secret
            }
        })
        res.writeHead(303, {
            Location: 'https://api.twitter.com/oauth/authenticate?' + body
        });
        res.end();
    })


    app.all(urls.callback, async (req, res) => {
        try {
            body = await rp.post({
                url: 'https://api.twitter.com/oauth/access_token',
                json: true,
                'oauth': {
                    consumer_key: keys.client_id,
                    consumer_secret: keys.client_secret,
                    verifier: req.query.oauth_verifier,
                    token: req.query.oauth_token,
                }
            })

            console.log(body);

            query = JSON.parse('{"' + decodeURI(body.replace(/&/g, "\",\"").replace(/=/g, "\":\"")) + '"}')
            url = `https://api.twitter.com/1.1/users/show.json?oauth_token_secret=${query.oauth_token_secret}&user_id=${query.user_id}&screen_name=${query.screen_name}`,

                data = await rp.get({
                    url,
                    json: true,
                    'oauth': {
                        consumer_key: keys.client_id,
                        consumer_secret: keys.client_secret
                    },
                    headers: {
                        'oauth_verifier': req.query.oauth_verifier,
                        'content-type': 'application/x-www-form-urlencoded'
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
