import { join, normalize } from "node:path"
import packageJSON from "../../package.json" with {type: "json"}
import { AnsiColor } from "../utils/ansiColor.js"
import { homedir } from "node:os"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"

const cacheFolder = normalize(join(homedir(), ".ttkdl-cli/cache"))
const filePath = normalize(join(cacheFolder, "version-check.json"))

async function notifyUpdate() {
   const shouldCheckForUpdate = checkCacheFile()
   
   if (shouldCheckForUpdate) {
      const currentVersion = packageJSON.version
      const npmCliVersion = await fetchNpmVersion()

      if (npmCliVersion) {
         if (npmCliVersion !== currentVersion) {
            process.stdout.write(`${AnsiColor.white("─────────────────────────────────────────────").result().replaceAll("\n", "")}\n`)
            process.stdout.write(`${AnsiColor.gray(`Update available: `).dim(npmCliVersion).gray(" → ").lightBlue(`${currentVersion}\n`).gray("Run").red(` "npm i -g @thiagobrg60/ttkdl-cli" `).gray("to update.").result()}\n`)
         }

         writeCacheFile()
      }
   }
}

function checkCacheFile() {
   if (!existsSync(filePath)) return true

   const parsedData = JSON.parse(readFileSync(filePath))
   const ONE_DAY_MS = 24 * 60 * 60 * 1000

   if (!parsedData.lastUpdateCheck || Date.now() >= (parsedData.lastUpdateCheck + ONE_DAY_MS)) return true

   return false
}

function writeCacheFile() {
   if (!existsSync(cacheFolder)) mkdirSync(cacheFolder, {recursive: true})

   writeFileSync(filePath, JSON.stringify({lastUpdateCheck: Date.now()}))
}

async function fetchNpmVersion() {
   try {
      const response = await fetch("https://registry.npmjs.org/@thiagobrg60/ttkdl-cli")
      const data = await response.json()
      const versions = Object.keys(data.versions)
      
      return data["dist-tags"] ? data["dist-tags"].latest : versions[versions.length - 1]      
   } catch (error) {
      console.log(AnsiColor.gray("Failed to fetch update information").result())
      return false
   }
}

export { notifyUpdate }