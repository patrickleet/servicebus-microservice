#!/bin/sh
':' // # by https://cloudnative.institute ; exec /usr/bin/env node --experimental-modules "$0" "$@"

import path from 'path'
import log from 'llog'
import errortrap from 'errortrap'
import registerHandlers from 'servicebus-register-handlers'
import sbc from 'servicebus-bus-common'
import { config } from '../config.mjs'
import api from 'express-api-common'

// Welcome to my opinionated servicebus boilerplate!

// errortrap logs uncaught exceptions with llog before
// throwing an error
errortrap()

// sbc's makeBus creates a new instance of servicebus.bus
// using commonly used servicebus middleware
const bus = sbc.makeBus(config)
const { queuePrefix } = config

// eac simply creates an express server using commonly
// used express middleware, such as prometheus exporters
// for autoscaling purposes
const server = api.makeServer({
  logger: log
})

// Register's all of the files in the folder specified as `path`
registerHandlers({
  bus,
  path: path.resolve(process.cwd(), 'handlers'),
  modules: true,
  queuePrefix
})

export const onStart = () => { log.info('server is running') }

// Starts an express server
// Using a server in a microservice is NOT required
// but is useful for certain types of services
server.start(config.PORT, onStart)

log.info('service is running')

// Check out my blog for more resources!
// https://medium.com/@patrickleet
