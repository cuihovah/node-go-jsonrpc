const net = require('net')

class JSONRPC {
    constructor(host, port) {
        this.count = 0
        this.client = new net.Socket()
        this.host = host
        this.port = port
    }
    async call(method, data) {
        const body = {
            method: method, 
            params: data, 
            id: this.count++
        }
        return new Promise((resolve, reject) => {
            this.client.connect(this.port, this.host, () => {
                this.client.write(JSON.stringify(body));
            })
            this.client.on('data', (data) => {
                try {
                    const ret = JSON.parse(data.toString())
                    if (ret.error !== null) {
                        this.client.destroy()
                        reject(new Error(ret.error))
                    } else {
                        this.client.destroy()
                        resolve(ret)
                    }
                } catch(err) {
                    reject(err)
                }
            })
            this.client.on('error', (err) => {
                this.client.destroy()
                reject(err)
            })
        })
    }
}

module.exports = JSONRPC



