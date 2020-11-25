let amqp = require('amqp-connection-manager');
const { AlgorithmStatus } = require('./algorithmStatus');

// delete - belong to algo
const axios = require('axios')

//#region Global Params
let connection;
let channelWrapper;
let consumersList;
let config;
let hkubeApi;
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

start = async (args,api) => {
  hkubeApi = api;
  channelWrapper = await connection.createChannel({
    json: true,
    setup: async (channel) => {
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
};

stop = async () => {
  await channelWrapper.close();
  await connection.close();
};
//#endregion

//#region Service Methods
async function handleConsume(queue, msg) {
  //let msgContent = JSON.parse(msg.content);
  let response ="did nothing";
  try{
     response = await hkubeApi.startAlgorithm(queue,[]);
  }catch(err){
    console.log(err)
  }
  console.log(response)


  let params = { mainServerResponse: response }
  // to get the info go to https://stub-result.herokuapp.com/ in your browser
  await axios.post("https://stub-result.herokuapp.com/", params)

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

  // delete - belong to algo
  // let msgContent = JSON.parse(msg.content);
  // let params = { a: msgContent.requestId, c: msgContent.cloudBody }
  // await axios.post(msgContent.returnUrl, params)

  // reject logic??
  //await channelWrapper.ack(msg);
}


async function pauseAlgo(algoName) {
  this.consumersList[algoName].isPaused = true;
  // pause logic
}

//#endregion

// To run localy copy the value of the data object in ../deployment-yamls/input.yaml into "input" 
//console.log(init({ "input": [{}] }).then(async () => { await start() }))
module.exports = { init, start, stop }