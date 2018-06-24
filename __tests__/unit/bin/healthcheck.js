import { exit, open, handleSuccessfulConnection, handleUnsuccessfulConnection } from 'healthcheck.mjs'

jest.mock('amqplib', () => ({
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
    exit({healthy: false})
    expect(global.process.exit).toBeCalledWith(1)
  })

  it('should not exit if healthy', () => {
    global.process.exit = jest.fn()
    exit({healthy: true})
    expect(global.process.exit).toBeCalledWith(0)
  })

  it('should not exit if healthy', () => {
    global.process.exit = jest.fn()
    exit()
    expect(global.process.exit).toBeCalledWith(0)
  })

  it('should open connection to amqp', (done) => {
    open.then(() => {
      done()
    })
  })

  it('should handleSuccessfulConnection by calling exit with {healthy: true}', () => {
    let mockExit = jest.fn()
    let fn = handleSuccessfulConnection(mockExit)
    fn()
    expect(mockExit).toBeCalledWith({healthy: true})
  })

  it('should handleUnsuccessfulConnection by calling exit with {healthy: false}', () => {
    let mockExit = jest.fn()
    let fn = handleUnsuccessfulConnection(mockExit)
    fn('test error')
    expect(mockExit).toBeCalledWith({healthy: false})
  })
})
