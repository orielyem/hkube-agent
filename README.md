# Hkube-Agent

Hkube-Agent is a Nodejs service for dealing with the transition to hkube deployed algorithms.

## Installation


```bash
npm install
npm start
```

## Deploy to Hkube

There are several ways as you can see in Hkube [documentation](https://hkube.io/learn/#integrate-algorithms).
In the following examples we will deploy via the cli.
Check cli [installation](https://hkube.io/learn/#cli)  

Then, first
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
We consume messages from multiple rabbitmq queues and pass it to the requested algorithm.
The number of instances of an algorithm is depend on the prefetch counter. Defualt prefetch counter is 1 but you can changed it in the config input (because there is only one message in the queue at any giving time changing the defualt is not very useful for now).
After consuming and starting an algorithm:
* V1 - The algorithm send result to the client.
* V2 - The algorithm return result to the agent and from there we send to the client.
* V3 - The algorithm return result to the agent and from there we publish it to RabbitMq queue.

## Notes
* When deploying to hkube make sure that your naming (algorithm, pipeline) are the same in all of the yaml files. 
* Hkube-agent uses other algorithms so you need to make sure that they are exists on hkube. In case that they are not you can add them using the deploy algorithm steps above.
* If you want to debug your algorithm on your computer while it's runing on Hkube cloud you take a look at local-debug folder.
* In all of the cases the algorithm must return something (even null)!! for the starAlgorithm operation to complete.
* If an algorithm instance was not used in some time(approximately 10 minutes), Hkube automatically takes it down. Which means that in the next run the algorithm module will need to load again and it will take some time.