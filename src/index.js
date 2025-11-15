#!/usr/bin/env node
import { checkArgs } from "./helpers/checkArgs.js"
import { executeFlags } from "./helpers/executeFlags.js"
import { checkSubcommands } from "./helpers/checkSubcommands.js"
import { downloadVideos } from "./helpers/downloadVideos.js"
import { AnsiColor } from "./utils/ansiColor.js"

const argv = checkArgs({args: process.argv})

try {
   const {args: {urls, subcommands}, flags, unknown} = argv
   const flagKeys = Object.keys(flags)
   checkSubcommands({subcommands, flagKeys})

   if (flagKeys.length > 0) await executeFlags({flags, subcommands})
   if (unknown.length > 0) throw new Error(`Unknown commands: ${unknown.map(item => `"${item}"`).join(", ")}`)
   if (urls.length === 0) throw new Error("No video URLs provided")
   
   downloadVideos({urls})
} catch (error) {
   process.stdout.write(AnsiColor.bold("Error: ").red().gray(`${error.message}\n`).dim(`Run "ttkdl -h" for more information\n`).result())
}