const mergeDotEnv = () => {
  const MODE_INDEX = 3
  let specificEnvironmentConfig = require('dotenv').config({path: __dirname + `/.env.${process.argv[MODE_INDEX]}`})

  // Reach this if when MODE_INDEX is not a env mode. It happens when running jest test
  if (specificEnvironmentConfig.error) {
    specificEnvironmentConfig = require('dotenv').config({ path: __dirname + '/.env.test' })
  }

  const genericEnvironmentConfig = require('dotenv').config({path: __dirname + `/.env`})

  return {
    ...genericEnvironmentConfig.parsed,
    ...specificEnvironmentConfig.parsed
  }
}

module.exports = mergeDotEnv
