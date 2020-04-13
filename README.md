# async-mqtt-mustache-events

## Installation

```
$ npm install async-mqtt-mustache-events
```

## Description
`async-mqtt-mustache-events` is a wrapper over async-mqtt and it resolves two issues:
```
- This lib creates an event on each subscription. Thus when you get a new 
message you don't need to detect from where the topic gets it. 
(You have better code without if's and switches)

- If you need to subscribe on topic with modifiable params then you can use 
a style like mustache template style. (more information in examples)
```

## Examples
### Include
```javascript
const MQTT = require("async-mqtt-mustache-events");
const client = MQTT.connect("tcp://somehost.com:1883"); 
```
### .subscribe(topic, event_name)
```javascript
//subscriber
client.subscribe(`temperature/{room}`, 'temperatureFromHome');
//listener
client.on('temperatureFromHome', (props, msg)=>{
    console.log(props);
    //{room: 'WS'}
    console.log(msg)
    // '23°C'
});

//tool subscribe on "temperature/+" topic in mqtt
```

### .unsubscribe(event_name)
```javascript
client.unsubscribe('temperatureFromHome')
```

### .publish(topic, message)
```javascript
client.publish('temperature/WS', '23°C')
```