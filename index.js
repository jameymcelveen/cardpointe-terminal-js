console.info("Collection Pre-Request Script")

const store = createStore(
    {
        site: 'bolt-uat',
        url: 'https://{{site}}.cardpointe.com',
        merchantId: '820000000072',
        authorization: 'ZCb8pPkXcZDVO0CIngLSFrBJgA/BYyUZIHT8zaj3MPg=',
        hsn: '',
        sessionKey: ''
    }
)

const configuration = {
    site : store.get('site'),
    url: store.get('url').replace('{{site}}', site),
    merchantId: store.get('merchantId'),
    authorization: store.get('Authorization')
}

const session = {
    get hsn() { return store.get('hsn') },
    set hsn(val) { store.set('hsn', val) },
    get sessionKey() { return store.get('X-CardConnect-SessionKey') },
    set sessionKey(val) { store.set('X-CardConnect-SessionKey',val) }
}

loadHsn(configuration, session)

function loadHsn(conf, sesh) {
    postRequest('/v2/listTerminals', (err, json) => {
        if(!err && json && json.terminals && json.terminals.length > 0) {
            sesh.hsn = json.terminals[0]
            console.info(`Environment variable {{hsn}} has been set to ${hsn}`)
        } else {
            console.error(`${endpoint} returned with an invalid response:\n${json}`)
        }
    })
}

function loadSession (conf, sesh) {

}

function postRequest(endpoint, conf, sesh, callback) {
    const request = {
        url: `${conf.url}${endpoint}`,
        method: 'POST',
        header: {
            'Content-Type': 'application/json',
            'Authorization': conf.authorization
        },
        body: {
            'Content-Type': 'application/json',
            'merchantId': conf.merchantId
        }
    };
    pm.sendRequest(request, function (err, response) {
        console.log('err: ' + err)
        console.log('response: ' + response.text())
        if (!err) {
            let json = rsp.json()
            console.log('json: ' + json)
            callback(null, json)
        } else {
            console.error(`${endpoint} returned with error:\n${err}`)
            callback(err, null)
        }
    });

}

function createStore(items) {
    const _items = items || {}
    return {
        get: (key) => _items[key],
        set: (key, val) => _items[key] = val
    }
}
