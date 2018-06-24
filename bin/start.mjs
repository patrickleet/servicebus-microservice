#!/bin/sh
':' // # by @patrickleet ; exec /usr/bin/env node --experimental-modules "$0" "$@"

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

// Register's all of the files in the folder specified as `path`
registerHandlers({
  bus,
  path: path.resolve(process.cwd(), 'handlers'),
  modules: true,
  queuePrefix
})

// you probably won't need a api/server for most services
// but if you want one:
// eac simply creates an express server using commonly
// used express middleware, such as prometheus exporters
// for autoscaling purposes
export const onStart = () => { log.info('server is running') }
const server = api.makeServer({
  logger: log
})
server.start(config.PORT, onStart)

// Check out my blog for more resources!
// https://medium.com/@patrickleet
// 
// Related Articles:
// https://hackernoon.com/learning-these-5-microservice-patterns-will-make-you-a-better-engineer-52fc779c470a
// https://hackernoon.com/what-makes-a-microservice-architecture-14c05ad24554
// https://codeburst.io/serverless-ish-a-scaling-story-5732945b93ab
// 
