# node-go-jsonrpc
The client jsonrpc for golang

## Install
```bash
> npm install node-go-jsonrpc
```

## Usage
### Server
```go
package main

import (
	"errors"
	"fmt"
	"log"
	"net/rpc"
	"net/rpc/jsonrpc"
)

type Args struct {
	A, B int
}

type Quotient struct {
	Quo, Rem int
}

type Arith int

func (t *Arith) Multiply(args *Args, reply *int) error {
	*reply = args.A * args.B
	return nil
}

func main() {
	wait := make(chan bool)
	arith := new(Arith)
	rpc.Register(arith)
	l, _ := net.Listen("tcp", ":PORT")
	for {
		conn, err := l.Accept()
		if err != nil {
			fmt.Println(err.Error())
			continue
		}
		go jsonrpc.ServeConn(conn)
	}
	<- wait
}
```

### Client
```js
const jsonrpc = require('node-go-jsonrpc')

// create a client
const client = new jsonrpc.JSONRPC("YOUR HOST", "YOUR PORT")

// call JSON-RPC server
const method = 'Arith.Multiply'
const params = [{A:7,B:8}]
const ret = await client.call(method, params)
```
