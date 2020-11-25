const NodejsWrapper = require('../src/node_modules/@hkube/nodejs-wrapper');
const alg = require("../src/index")
const main = async () => {
    NodejsWrapper.debug("ws://playground.hkube.io/hkube/debug/fn110",alg)
}
main()