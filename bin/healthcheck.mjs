#!/bin/sh 
":" //# by https://cloudnative.institute ; exec /usr/bin/env node --experimental-modules "$0" "$@"

import amqplib from 'amqplib'

const open = amqplib.connect(process.env.RABBITMQ_URL);

const exit = ({healthy = true}) => {
  console.log({healthy})
  return healthy ? process.exit(0) : process.exit(1)
}

open.then(() => {
  exit({healthy: true})
}).catch((e) =>{
  exit({healthy: false})
})
