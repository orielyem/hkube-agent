let amqp = require('amqp-connection-manager');
const { AlgorithmStatus } = require('./algorithmStatus');

//#region Global Params
let connection;
let channelWrapper;
let consumersList;
let config;
let hkubeApi;
let stopper = null;
let defualtPrefetch = 2;
//#endregion

//#region Hkube Methods
init = async (args) => {
  config = args.input[0]
  try {
    connection = await amqp.connect(config.rabbitMqSettings.url)
  } catch (err) {
    console.log("connection failed")
    throw err
  }
  consumersList = []
}

start = async (args, api) => {
  const stopPromise = new Promise(async (resolve) => {
    stopper = resolve;
    hkubeApi = api;
    channelWrapper = await connection.createChannel({
      json: true,
      setup: async (channel) => {
        await channel.prefetch(config.prefetch !== undefined ? config.prefetch : defualtPrefetch, false)
        await config.rabbitMqSettings.queuesToConsume.forEach(async (queue) => {
          consumersList[queue] = new AlgorithmStatus();
          await channel.assertQueue(queue, {
            durable: true
          });
          await channel.consume(queue, async (msg) => {
            await handleConsume(queue, msg);
          });
        });
        return channel;
      }
    });
  });
  await stopPromise;
};

stop = async () => {
  await channelWrapper.close();
  if (stopper) {
    stopper();
    stopper = null;
  }
  await connection.close();
};
//#endregion

//#region Service Methods
async function handleConsume(queue, msg) {
  let msgContent = JSON.parse(msg.content);
  let response;

  try {
    response = await hkubeApi.startAlgorithm(queue, [{ ...msgContent }]);
  } catch (err) {
    console.log(err)
    throw err
  }

  // reject logic??
  //await channelWrapper.ack(msg);

  //#region Next gen
  // try/catch logic needed!!
    //#region V2 - the agent send the response to the result url
  // try {
  //   response = await hkubeApi.startAlgorithm(queue, [msgContent.cloudBody]);
  // } catch (err) {
  //   console.log(err)
  //   throw err
  // }
  //await axios.post(msgContent.resultUrl, response)
  //#endregion

    //#region  V3 - the agent send the response to result queue
  // try {
  //   response = await hkubeApi.startAlgorithm(queue, [msgContent.cloudBody]);
  // } catch (err) {
  //   console.log(err)
  //   throw err
  // }
  //await channelWrapper.publish(config.exchangeName,`${routingKey}-${queue}`,Buffer.from(JSON.stringify(response)));
  //#endregion
  
  //#endregion
 
  //#region TO DELETE
  // if (!consumersList[queue].isPuased) {
  //   // TODO send to algo with msgConsumed
  //   // response= await axios.post('https://playground.hkube.io/hkube/monitor-server//store/algorithms/apply').data
  // } else {
  //   // TODO RESUME
  //   // response= await axios.get('https://hkube-result.herokuapp.com/aaa').data
  //   consumersList.isPaused = false;
  // }

  // algo timeout
  // consumersList[queue].timeout === undefined ?
  // consumersList[queue].timeout =setTimeout(pauseAlgo(response.jobId), config.timeoutInMilliseconds):
  //   (() => {
  //     clearTimeout(this.consumersList[queue].timeout)
  //     this.consumersList[queue].timeout = setTimeout(pauseAlgo(response.jobId), config.timeoutInMilliseconds)
  //   })();
  //#endregion

}


//#region TO DELETE
async function pauseAlgo(algoName) {
  this.consumersList[algoName].isPaused = true;
  // pause logic
}
//#endregion

//#endregion

// To run localy copy the value of the data object in ../deployment-yamls/input.yaml into "input" 
//console.log(init({ "input": [{}] }).then(async () => { await start() }))
module.exports = { init, start, stop }