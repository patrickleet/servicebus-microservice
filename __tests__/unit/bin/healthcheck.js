import { exit, check, handleSuccessfulConnection, handleUnsuccessfulConnection } from 'healthcheck.mjs'

jest.mock('servicebus-bus-common')
jest.mock('sourced-repo-mongo/mongo', () => ({
  connect: jest.fn(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, 100)
    })
  })
}))

describe('./bin/healthcheck.mjs', () => {
  it('should define an exit function', () => {
    expect(exit).toBeDefined()
  })

  it('should exit when unhealthy', () => {
    global.process.exit = jest.fn()
    exit({ healthy: false })
    expect(global.process.exit).toBeCalledWith(1)
  })

  it('should not exit if healthy', () => {
    global.process.exit = jest.fn()
    exit({ healthy: true })
    expect(global.process.exit).toBeCalledWith(0)
  })

  it('should not exit if healthy', () => {
    global.process.exit = jest.fn()
    exit()
    expect(global.process.exit).toBeCalledWith(0)
  })

  it('should check connection to amqp', (done) => {
    check().then(() => {
      done()
    })
  })

  it('should handleSuccessfulConnection by calling exit with {healthy: true}', () => {
    const mockExit = jest.fn()
    const fn = handleSuccessfulConnection(mockExit)
    fn()
    expect(mockExit).toBeCalledWith({ healthy: true })
  })

  it('should handleUnsuccessfulConnection by calling exit with {healthy: false}', () => {
    const mockExit = jest.fn()
    const fn = handleUnsuccessfulConnection(mockExit)
    fn('test error')
    expect(mockExit).toBeCalledWith({ healthy: false })
  })
})
