import { connect as _connect } from 'async-mqtt';
import EventEmitter from 'events';

class MustacheMQTT extends EventEmitter {
    constructor(client) {
        super()
        this._client = client;
        this._reTopics = new Map();
        this._eventNameTopic = new Map();
        this._client.on('message', this._handleMessage.bind(this));
    }

    async publish(...args) {
        return this._client.publish(...args);
    }

    async subscribe(topic, eventName) {
        const reTopic = await this._createRegExp(topic);
        const tempTopic = await this._replaceTopic(topic);
        const positions = await this._getPosititons(topic);
        this._reTopics.set(reTopic, {
            eventName: eventName,
            props: positions
        });
        this._eventNameTopic.set(eventName, tempTopic)
        await this._client.subscribe(tempTopic);
        return true;

    }

    async unsubscribe(eventName) {
        const topic = this._eventNameTopic.get(eventName)
        return this._client.unsubscribe(topic)
    }

    _handleMessage(topic, msg) {
        const splitedTopic = topic.split('/')
        for (let [key, value] of this._reTopics) {
            if (key.exec(topic)) {
                const props = {};
                for (key in value.props) {
                    props[key] = splitedTopic[value.props[key]]
                }
                this.emit(value.eventName, props, msg, value.eventName)
                break
            }
        }
        return;
    }

    async _createRegExp(topic) {
        return new RegExp(`^${topic
            .replace(/({\w+})/g, `(.+)`)}$`,'g')
    }

    async _replaceTopic(topic) {
        return topic
            .replace(/({\w+})/g, '+')
    }

    async _getPosititons(topic) {
        const keys = await topic.match(/{(\w+)}/g) || [];

        const positions = {};
        const splitedTopic = topic.split('/');

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i].replace('{', '').replace('}', '')
            positions[key] = splitedTopic.indexOf(keys[i]);
        }
        return positions;
    }

}


export function connect(brokerURL, opts) {
    const mqttClient = _connect(brokerURL, opts);
    const mustacheMQTTClient = new MustacheMQTT(mqttClient);

    return mustacheMQTTClient;
}