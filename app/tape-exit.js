// DB connections and express server keep process running
// This forces an exit
require('tape-catch').onFinish(process.exit)
