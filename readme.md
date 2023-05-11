# Installation

* Install [Node.js](https://nodejs.org/en)
* Install packages
`npm install` in both [Server](/server) and [Frontend](/frontend) folders
* Configure TCP/UDP connection
```dotenv
HOST=XXX.XXX.XXX.XXX # host of tcp/udp server
PORT=8002 # port of tcp/udp server
TCP=1 # TCP=0 means using UDP
```
* Prepare database using `npm prepare` in [Server](/server) folder
* To start project start use `npm start` in both [Server](/server) and [Frontend](/frontend) directories


