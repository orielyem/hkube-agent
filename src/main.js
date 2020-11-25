const NodejsWrapper = require('@hkube/nodejs-wrapper');
const alg = require("./index")
const main = async () => {
    NodejsWrapper.debug("ws://playground.hkube.io/hkube/debug/fn110",alg)
}

main()