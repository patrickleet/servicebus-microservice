import debug from 'debug'
import servicebus from 'servicebus'

const log = debug('microservice')

log('rmq', process.env.RABBITMQ_URL)
const bus = servicebus.bus({
  url: process.env.RABBITMQ_URL
})
bus.use(bus.package())

jasmine.DEFAULT_TIMEOUT_INTERVAL = 15 * 1000

describe('service', () => {
  beforeAll(function (done) {
    log('preparing for tests')
    bus.on('ready', () => {
      log('bus is ready')

      // TODO: connect to sql
    })
  })

  afterAll(() => {
    // give messages some time to send before closing bus
    setTimeout(() => {
      bus.close()
    }, 5000)
  })

  it('command', (done) => {
    bus.listen('context.domain.aggregate.entity.command', () => {
      done()
    })
    bus.send('context.domain.aggregate.entity.command', {})
    log('sent context.domain.aggregate.entity.command command')
  })
})
