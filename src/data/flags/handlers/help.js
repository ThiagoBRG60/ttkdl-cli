import { readFileSync } from "node:fs"
import { join } from "node:path"
import { state } from "../state.js"
import { AnsiColor } from "../../../utils/ansiColor.js"

function handleHelpFlag() {
   const helpText = readFileSync(join(import.meta.dirname, "../../help.txt")).toString().replace("{root}", state.rootFolder)
   process.stdout.write(AnsiColor.gray(helpText).result())
   process.on("exit", () => process.stdout.write("\n"))
   process.exit(0)
}

export { handleHelpFlag }