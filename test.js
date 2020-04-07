const assert = require('assert');
const MustacheMQTT = require('./index');

const MQTT_SERVER_PORT = 1883;
const MQTT_SERVER_URL = `mqtt://localhost:${MQTT_SERVER_PORT}`
const PUBLISH_TOPIC = `temperature/WS`;
const VARIABLE_TOPIC_NAME = `room`
const SUBSCRIBE_TOPIC = `temperature/{${VARIABLE_TOPIC_NAME}}`;
const EVENT_NAME = 'test';
const TEST_MESSAGE = `It's test message`

describe('Connection', () => {
    var mustacheMQTTClient = MustacheMQTT.connect(MQTT_SERVER_URL)


    describe('#subscibe()', function () {
        it('subscribe to mustache topic template', async function () {
            await mustacheMQTTClient.subscribe(SUBSCRIBE_TOPIC, EVENT_NAME)
        });
    });

    describe('#on()', function () {
        it('create event listener', function () {
            mustacheMQTTClient.on(EVENT_NAME, subHandler)
        });
    });

    function subHandler(props, msg) {
        describe('#checkAnswer', function () {
            it('checking props', function (done) {
                assert.equal(props.hasOwnProperty(VARIABLE_TOPIC_NAME),true)
                done()
            });
        });
    }

    describe('#publish()', function () {
        it('publishing message', async function () {

            await mustacheMQTTClient.publish(PUBLISH_TOPIC, TEST_MESSAGE)
        });
    })
});