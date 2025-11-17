import process from "node:process"
import packageJSON from "../../../../package.json" with {type: "json"}

function handleVersionFlag() {
   console.log(`v${packageJSON.version}`)
   process.exit(0)
}

export { handleVersionFlag }