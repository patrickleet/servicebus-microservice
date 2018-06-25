import debug from 'debug'
import sbc from 'servicebus-bus-common'

const config = {
  prefetch: 10,
  queuePrefix: 'test-microservice',
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || '6379'
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost:5672'
  },
  mongo: {
    url: process.env.MONGO_URL || 'mongodb://localhost:27017/microservice'
  }
}

const log = debug('microservice')

const rmq = process.env.RABBITMQ_URL || 'amqp://localhost:5672'

log('service test: rmq', rmq)

jasmine.DEFAULT_TIMEOUT_INTERVAL = 15 * 1000

describe('service', () => {
  let bus

  beforeAll(async function (done) {
    log('preparing for tests')

    bus = await sbc.makeBus(config)

    done()
  })

  afterAll(() => {
    // give messages some time to send before closing bus
    bus.close()
    log('closing bus', bus.channels)
    // bus.channels.forEach(function (channel) {
    //   channel.close();
    // });
    // bus.connection.close();

    log('closed')
  })

  it('list.item.add command', async (done) => {
    let testCommand = 'list.item.add'
    let newItem = {
      item: {
        todo: 'write tests',
        complete: false
      },
      todoListId: 'test - list.item.add command'
    }

    let doTest = () => {
      return new Promise((resolve, reject) => {
        bus.subscribe('list.item.added', { ack: true }, (event, cb) => {
          log('acking message')
          event.handle.ack(() => {
            resolve(event)
          })
        })

        bus.send(testCommand, newItem, { ack: true })
        log(`sent ${testCommand} command`)
      })
    }

    let event = await doTest()

    expect(event).toBeDefined()
    expect(event.data).toEqual(newItem.item)
    expect(event.datetime).toBeDefined()
    expect(event.type).toBe('list.item.added')
    expect(typeof event.handle.ack).toBe('function')

    done()
  })
})
