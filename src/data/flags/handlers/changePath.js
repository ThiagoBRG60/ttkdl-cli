import { dirname, join, normalize, relative, resolve } from "node:path"
import { existsSync, mkdirSync, writeFileSync } from "node:fs"
import { sleep } from "../../../utils/sleep.js"
import { state, configFilePath } from "../state.js"
import { AnsiColor } from "../../../utils/ansiColor.js"

const sleepFn = sleep()

async function handleChangePathFlag({flagName, subcommand, value}) {
   const isRootFlag = flagName === "-r" || flagName === "--root"

   if (isRootFlag && !subcommand.includes("config")) throw new Error(`The "${flagName}" option requires the "config" subcommand`)

   if (!value || !value.trim()) throw new Error(`The "${flagName}" option requires a valid path`)

   const newPath = resolve(relative(process.cwd(), normalize(value.trim())))
   const checkAnswer = (search, text) => search === "yes" ? /^y(es)?$/i.test(text) : /^n(o)?$/i.test(text)

   if (newPath.includes("ttkdl-cli")) throw new Error(`The ${isRootFlag ? "new root" : "save path"} cannot be the current directory`)
   
   function changePath() {
      if (isRootFlag) {
         if (!existsSync(dirname(configFilePath))) mkdirSync(dirname(configFilePath))
         writeFileSync(configFilePath, JSON.stringify({outputDir: join(newPath, "/ttkdl-cli/videos")}))
         return
      }
   
      state.rootFolder = join(newPath, "/ttkdl-cli/videos")
   }

   if (state.confirmFlag && checkAnswer("yes", state.confirmFlag)) {
      changePath()
      process.stdout.write(AnsiColor.lightBlue("✓").gray(` ${isRootFlag ? "Default root" : "Save path"} changed successfully`).result())
   } else {
      process.stdout.write(AnsiColor.lightBlue("?").gray(" Do you want to change the path to: ").red(`"${join(newPath, "/ttkdl-cli/videos")}"`).gray("?").dim(" [y/n]\n").result())

      process.stdin.on("data", (data) => {
         const answer = data.toString().trim()

         if (checkAnswer("yes", answer)) changePath()
         
         process.stdout.write(checkAnswer("yes", answer) ? AnsiColor.lightBlue("✓").gray(` ${isRootFlag ? "Default root" : "Save path"} changed successfully`).result() : checkAnswer("no", answer) ? AnsiColor.gray("Aborted.").result() : AnsiColor.bold("Error: ").red().gray("Invalid response\n").dim("Aborted.").result())
         if (checkAnswer("no", answer) || (!checkAnswer("yes", answer) && !checkAnswer("no", answer))) process.exit(0)

         if (!isRootFlag) process.stdin.destroy()
         sleepFn.cancel()
      })
      
      await sleepFn.promise()
   }

   if (isRootFlag) {
      process.on("exit", () => process.stdout.write("\n"))
      process.exit(0)
   }
}

export { handleChangePathFlag }