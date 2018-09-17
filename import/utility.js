/**
 * stdin to read input from user
 */
const stdin = process.openStdin()

/**
 * Captures input from stdin
 */
const captureArgument = (resolve, reject) => {
  const listener = (d) => {
    // https://stackoverflow.com/questions/8128578/reading-value-from-console-interactively
    stdin.removeListener('data', listener)
    resolve(d.toString().trim())
  }
  return listener
}

const captureArgumentWithMessage = (message) => {
  console.log(message)
  return new Promise((resolve, reject) => stdin.addListener('data', captureArgument(resolve, reject)))
}

module.exports.captureArgumentWithMessage = captureArgumentWithMessage
