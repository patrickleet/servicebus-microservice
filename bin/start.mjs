#!/bin/sh 
":" //# by https://cloudnative.institute ; exec /usr/bin/env node --experimental-modules "$0" "$@"

import path from 'path'
import log from 'llog'
import errortrap from 'errortrap'
import registerHandlers from 'servicebus-register-handlers'
import sbc from 'servicebus-bus-common';
import { config } from '../config.mjs'
import server from 'express-api-common'

errortrap()

const bus = sbc.makeBus(config)
const { queuePrefix } = config

registerHandlers({
  bus,
  path:  path.resolve(process.cwd(), 'handlers'),
  modules: true,
  queuePrefix
})

server.start()

log.info('service is running')
