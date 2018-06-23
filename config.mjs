import cconfig from 'cconfig'

// Using cconfig, a "cascading config" library, env variables will be
// cascaded on top of the default configuration.

const defaultConfig = {
  PORT: 3000,
  prefetch: 10,
  secretPath: '/run/secrets/',
  queuePrefix: 'microservice',
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL
  }
}

// add env variables on top of defaultConfig
let cascadedConfig = cconfig(defaultConfig)

// Everything that comes in from command line is a string,
// if you need a type, convert it here by the key name
const finalConfig = Object.keys(cascadedConfig).reduce((finalConfig, key) => {
  let value = cascadedConfig[key]

  switch (key) {
  case 'PORT':
    value = parseInt(value, 10)
    break

  default:
    break
  }

  finalConfig[key] = value
  return finalConfig
}, {})


export const config = finalConfig
