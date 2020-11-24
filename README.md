# Hkube-Agent

Hkube-Agent is a Nodejs service for dealing with the transition to hkube deployed algorithms.

## Installation


```bash
npm install
npm start
```

## Deploy to Hkube

There are several ways as you can see in Hkube [documentation](https://hkube.io/learn/#integrate-algorithms).

We will deploy via the cli.
After cli [installation](https://hkube.io/learn/#cli)  

First
```bash
cd <YOUR_PROJECT_LOCATION>/hkube-agent
```
we will archive the src folder as .zip

```bash
cd <YOUR_PROJECT_LOCATION>/hkube-agent/deployment-yamls
```

#### Algorithm

After we have src.zip, we add the service as an algorithm
```bash
hkubectl algorithm apply --f hkube-agent-service.yaml
```

#### Pipeline
  

After the algorithm was added, we will store the pipeline
```bash
hkubectl pipeline store --f algorithms-pipeline.yaml
```

After the store command completed we run the pipeline with our input 
```bash
hkubectl exec stored Algorithms --f input.yaml
```

Great! now the agent is up and running (hopefully).

## Quick Run Through On Hkube Service Structure


init
```js
init = async (args) => {
  // initialize connections, config, etc
}
```

start
```js
start = async () => {
  // main logic here 
  // using vars that we initialize in init()
}
```

stop
```js
stop = async () => {
  // close connections and dispose resources
}
```

export
```js
module.exports = { init, start, stop }
```

## Hkube-Agent Summary
We consume messages from multiple rabbitmq queues and pass it to the requested algorithm. If we didn't get any message in a fixed time we stoping the algorithm process to save resources. When we receive a message again the start command bring it back to life

## Notes
* When deploying to hkube make sure that your naming (algorithm, pipeline) are the same in all of the yaml files. 