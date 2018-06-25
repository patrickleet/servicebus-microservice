import debug from 'debug'
import servicebus from 'servicebus'
import sbc from 'servicebus-bus-common'

const config = {
  prefetch: 10,
  queuePrefix: 'test-microservice',
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL
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
    setTimeout(() => {
      log('closing bus')
      bus.close()
    }, 100)
  })

  it('list.item.add command', (done) => {
    let doTest = new Promise((resolve, reject) => {
      let testCommand = 'list.item.add'
      let newItem = {
        item: {
          todo: 'write tests',
          complete: false
        }
      }

      bus.subscribe('list.item.added', { ack: true }, (event, cb) => {
        log('received event', event, cb)
        expect(event).toBeDefined()
        expect(event.data).toEqual(newItem.item)
        expect(event.datetime).toBeDefined()
        expect(event.type).toBe('list.item.added')
        expect(typeof event.handle.ack).toBe('function')
        event.handle.ack()
        resolve()
      })

      setTimeout(() => {
        bus.send(testCommand, newItem, { ack: true })
        log(`sent ${testCommand} command`)
      }, 500)
    })

    try {
      doTest
        .then(() => {
          log('list.item.add command test')
          setTimeout(() => {
            done()
          }, 2000)
        })
    } catch (e) {
      log(e)
    }

  })

})
