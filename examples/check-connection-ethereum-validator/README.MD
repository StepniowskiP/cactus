##### check-connection-ethereum-validator

Business Logic Plugin for checking communication with ethereum ledger via cactus-plugin-ledger-connector-go-ethereum-socketio

### Setup 

Before booting, please prepare the directory for storing config files on the directoty /etc/cactus on your server

sudo mkdir /etc/cactus
sudo chmod 777 /etc/cactus

# Start docker environment for Go-Ethereum testnet
cd cactus/tools/docker/geth-testnet
./script-start-docker.sh

# Launch ethereum connector

1. Install npm packages and build them
cd cactus/packages/cactus-plugin-ledger-connector-go-ethereum-socketio
npm install
npm run build

2. Create symbolic link to node_modules
npm run init-ethereum

3. Create docker image
docker-compose -f docker-compose.yaml build

4. Launch container
docker-compose -f docker-compose.yaml up

# Launch  socket server and BLP

1. Install and build npm packages on cactus-cmd-socker-server
cd cactus/packages/cactus-cmd-socker-server
npm install
npm run build

2. Install and build npm packages on cactus/examples/check-connection-ethereum-validator
cd cactus/examples/check-connection-ethereum-validator
npm install
npm run build

3. Create the symbolic link to node_modules.
cd cactus/examples/check-connection-ethereum-validator
npm run init-check-connection-ethereum-validator

4. Launch BLP
cd cactus/examples/check-connection-ethereum-validator
npm run start

# How to use

Application checks connection by getting balance on ethereum ledger
To execute run:
curl localhost:5034/api/v1/bl/check-ethereum-validator -XPOST -H "Content-Type: application/json" -d '{"businessLogicID":"jLn76rgB"}'