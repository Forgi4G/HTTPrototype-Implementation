const https = require('https'),
      zlib = require('zlib');

Object.prototype.request = function() {
    const opts = {
        hostname: this.hostname,
        path: this.path || '',
        method: this.method || 'GET',
    }
    this.headers ? opts.headers = this.headers : {};

    opts.sanitizeHeaders();

    if (opts.method.toUpperCase() === 'GET') {
        return new Promise(res => {
            https.request(opts, async cb => {
                let b = '';

                if ((cb.headers['content-encoding'] && cb.headers['content-encoding'].toLowerCase() === 'gzip') || opts.headers['Accept-Encoding'].toLowerCase() === 'gzip') {
                    res(await opts.getReq());
                } else if (!cb.headers['content-encoding'] || cb.headers['content-encoding'].toLowerCase() === 'utf-8') {
                    cb.on('data', d => b += d.toString());
                    cb.on('end', () => res(b));
                }
            }).end();
        });
    }

    if (opts.method.toUpperCase() === 'POST') {
        if (this.body) {
            opts.body = typeof this.body === 'object' ? JSON.stringify(this.body) : typeof this.body === 'string' ? this.body : JSON.stringify({});
        }

        let buffer = Buffer.from(opts.body);
        opts.headers['Content-Encoding'] = this.headers['Accept-Encoding'] || 'gzip';
        opts.headers['Content-Length'] = buffer.length;
        opts.encoding = null;

        return new Promise(res => {
            const req = https.request(opts, async cb => {

                let b = '';

                cb.on('data', da => b += da.toString());
                cb.on('end', () => {
                    try {
                        res(JSON.parse(b));
                    } catch (e) {
                        res(b);
                    }
                });
            });
            req.write(buffer);
            req.end();
        });
    }
};

Object.prototype.getReq = async function() {
    const opts = this;
    opts.hostname = this.hostname; opts.path = this.path || ''; opts.method = 'GET';
    opts.headers = {}; opts.headers['Accept-Encoding'] = 'gzip';
    return new Promise((res, rej) => {
        https.get(opts, cb => {
            let gz = cb.pipe(zlib.createGunzip());
            let body = [];
            gz.on('data', d => body.push(d.toString()));
            gz.on('end', () => res(body.join('')));
            gz.on('error', error => rej(error));
        });
    });
};

Object.prototype.sanitizeHeaders = function() {
    if (this.headers) {
        for (let i in this.headers) {
            if (this.headers.hasOwnProperty(i)) {
                if (i !== i.toLowerCase()) {
                    Object.defineProperty(this.headers, i.toLowerCase(),
                        Object.getOwnPropertyDescriptor(this.headers, i));
                    delete this.headers[i];
                }
            }
        }
    }
    return this.headers;
};

Object.prototype.print = function() {
    return console.log(this);
};

module.exports = {
    request, getReq, sanitizeHeaders, print
};