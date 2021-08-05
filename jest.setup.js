import mergeDotEnv from './envLoader'

process.env = mergeDotEnv()

// Define default time limit for test
jest.setTimeout(10000)
