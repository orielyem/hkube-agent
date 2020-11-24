var amqp = require('amqplib');
const {AlgorithmStatus} = require('./algorithmStatus');

// delete belong to algo
const axios = require('axios')

let connection;
let channel;
var consumersList;
let config;

init = async (args) => {
  config = args.input[0]
  try {
    connection = await amqp.connect(config.rabbitMqSettings.url)
    channel = await connection.createChannel();
  } catch (err) {
    console.log("connection failed")
    throw err
  }
  consumersList = []
}

start = async () => {
  await config.rabbitMqSettings.queuesToConsume.forEach(async (queue) => {
    consumersList[queue] = new AlgorithmStatus();
    await channel.assertQueue(queue, {
      durable: true
    });
    await channel.consume(queue, async (msg) => {
      await handleConsume(queue, msg.content.toString())
     await channel.ack(msg);
    });
  });
};

async function handleConsume(queue, msg) {
  let response;
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

  // delete belong to algo
  let params = {a:msgConsumed.requestId,c:msgConsumed.cloudBody}
  await axios.post(msgConsumed.returnUrl,params)
}

async function pauseAlgo(algoName) {
  this.consumersList[algoName].isPaused = true;

  // pause logic
}

console.log(init({ "input": [require('./deployment-yamls/config')] }).then(async () => { await start() }))
module.exports = { init, start }