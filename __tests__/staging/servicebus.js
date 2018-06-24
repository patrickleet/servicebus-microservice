import debug from 'debug'
import servicebus from 'servicebus'

const log = debug('microservice')

const rmq = process.env.RABBITMQ_URL || 'amqp://localhost:5672'

log('rmq', rmq)

jasmine.DEFAULT_TIMEOUT_INTERVAL = 15 * 1000

describe('service', () => {
  let bus, bus2

  beforeAll(function (done) {
    log('preparing for tests')

    bus = servicebus.bus({
      url: rmq
    })

    bus.use(bus.package())

    bus.on('ready', () => {
      log('bus is ready')

      bus2 = servicebus.bus({
        url: rmq
      })
      bus2.use(bus.package())

      bus2.on('ready', () => {
        log('bus2 is ready')
        done()
      })
    })
  })

  afterAll(() => {
    // give messages some time to send before closing bus
    setTimeout(() => {
      bus.close()
      bus2.close()
    }, 500)
  })

  it('commands work as expected', (done) => {
    let doTest = new Promise((resolve, reject) => {
      let testCommand = 'test.command'
      let newItem = {
        item: {
          todo: 'write tests',
          complete: false
        }
      }

      bus2.listen('test.command', (command) => {
        log('received command')
        expect(command).toBeDefined()
        expect(command.data).toEqual(newItem)
        expect(command.datetime).toBeDefined()
        expect(command.type).toBe(testCommand)
        resolve()
      })

      setTimeout(() => {
        bus.send(testCommand, newItem)
        log(`sent ${testCommand} command`)
      }, 500)
    })

    doTest
      .then(() => {
        log('command test done')
        done()
      })
  })

  it('events work as expected', (done) => {
    let doTest = new Promise((resolve, reject) => {
      let testEvent = 'test.commanded'
      const eventData = {
        commanded: true
      }
      bus2.subscribe(testEvent, (event) => {
        log('received event')
        expect(event).toBeDefined()
        expect(event.data.commanded).toBe(true)
        expect(event.type).toBe('test.commanded')
        expect(event.datetime).toBeDefined()
        resolve()
      })

      setTimeout(() => {
        bus.publish(testEvent, eventData)
        log(`sent ${testEvent} command`)
      }, 500)
    })

    doTest
      .then(() => {
        log('event test done')
        done()
      })
  })
})
