import { state } from "../state.js"

function handleMaxFlag({flagName, value}) {
   if (isNaN(value) || value <= 0 || value > 5) throw new Error(`The "${flagName}" option requires values between 1 and 5`)
   state.concurrentDownloads = parseInt(value)
}

export { handleMaxFlag }