import { existsSync } from "node:fs"
import { homedir } from "node:os"
import { join, normalize } from "node:path"
import { pathToFileURL } from "node:url"

const configFilePath = normalize(join(homedir(), ".ttkdl-cli/cache/config.json"))
const configFile = existsSync(configFilePath) && (await import(pathToFileURL(configFilePath), {with: {type: "json"}})).default.outputDir

const state = {
   rootFolder: configFile || join(homedir(), "ttkdl-cli/videos"),
   concurrentDownloads: 3,
   confirmFlag: ""
}

export { state, configFilePath }