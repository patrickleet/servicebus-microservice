import debug from 'debug'
import { makeBus } from 'servicebus-bus-common'

const config = {
  prefetch: 10,
  queuePrefix: 'test-todolist-model-service',
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || '6379'
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost:5672'
  },
  mongo: {
    url: process.env.MONGO_URL || 'mongodb://localhost:27017/todolist-model-service'
  }
}

const log = debug('todolist-model-service')

const rmq = process.env.RABBITMQ_URL || 'amqp://localhost:5672'

log('service test: rmq', rmq)

jasmine.DEFAULT_TIMEOUT_INTERVAL = 15 * 1000

describe('service', () => {
  let bus

  beforeAll(async function (done) {
    log('preparing for tests')

    bus = await makeBus(config)

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
    const testCommand = 'list.item.add'
    const newItem = {
      item: {
        todo: 'write tests',
        complete: false
      },
      todoListId: 'test - list.item.add command'
    }

    const doTest = () => {
      return new Promise((resolve, reject) => {
        bus.subscribe('list.item.added', { ack: true }, (event, cb) => {
          log('acking message')
          event.handle.ack(() => {
            resolve(event)
          })
        })

        setTimeout(() => {
          bus.send(testCommand, newItem, { ack: true })
          log(`sent ${testCommand} command`)
        }, 500)
      })
    }

    const event = await doTest()

    expect(event).toBeDefined()
    expect(event.data).toEqual(newItem.item)
    expect(event.datetime).toBeDefined()
    expect(event.type).toBe('list.item.added')
    expect(typeof event.handle.ack).toBe('function')

    done()
  })
})
