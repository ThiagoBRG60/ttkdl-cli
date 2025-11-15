import { readFileSync } from "node:fs"
import { join } from "node:path"
import { AnsiColor } from "../utils/ansiColor.js"

function showBanner() {
   const colors = {red: "\x1b[38;2;255;0;90m", lightBlue: "\x1b[38;2;0;255;255m", white: "\x1b[38;2;255;255;255m", reset: "\x1b[0m"}
   const cliName = readFileSync(join(import.meta.dirname, "../data/banner.txt")).toString("utf-8")

   process.stdout.write(cliName.replaceAll("{red}", colors.red).replaceAll("{lightBlue}", colors.lightBlue).replaceAll("{white}", colors.white).replaceAll("{reset}", colors.reset))
   drawLine()
   process.stdout.write("\n\x1b[?25l")
}

function drawLine() {
   process.stdout.write(AnsiColor.white("─────────────────────────────────────────────").result())
}

function showStatus({status}) {
   process.stdout.write(status)
}

function showSpinner() {
   const spinner = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
   let spinnerIndex = 0
   let intervaldId

   function start({label, current, total}) {
      if (intervaldId) clearInterval(intervaldId)

      intervaldId = setInterval(() => {
         if (spinnerIndex === spinner.length - 1) spinnerIndex = 0
         process.stdout.write(`\r${AnsiColor.lightBlue(spinner[spinnerIndex]).gray(` ${label} `).dim(`(${current}/${total})`).result().replaceAll("\n", "")}`)
         spinnerIndex++
      }, 100)
   }

   function cancel() {
      if (intervaldId) clearInterval(intervaldId)
   }

   return {start, cancel}
}

function showProgress({percent, downloadSpeed, remainingTime}) {
   const barSize = {current: Math.floor(percent / 10), total: 10}
   const progressBar = AnsiColor.red("[").lightBlue(`${"▓".repeat(barSize.current)}${"\x1b[38;2;255;0;90m-\x1b[0m".repeat(barSize.total - barSize.current)}`).red("]").lightBlue(` ${percent}% `).result().replaceAll("\n", "")
   const downloadInfo = AnsiColor.dim(`(${downloadSpeed}/s | ~${remainingTime} remaining)`).result().replaceAll("\n", "")

   process.stdout.write(percent !== 100 ? `\r\x1b[K${progressBar + downloadInfo}` : `\r\x1b[K${progressBar}`)
}

function showSummary({totalVideos, errorsCount, totalSize, time, path}) {
   const summaryIcon = totalVideos === 0 ? AnsiColor.red("✕") : AnsiColor.lightBlue("✓")

   showStatus({status: summaryIcon.gray(totalVideos === 0 ? ` Failed to download videos\n` : ` ${totalVideos} ${totalVideos > 1 ? "videos" : "video"} downloaded successfully!${errorsCount ? ` \x1b[38;2;255;0;90m[${errorsCount} ${errorsCount > 1 ? "errors" : "error"}]\x1b[0m` : ""}\n`).dim(` • Total: `).red(`${totalSize}\n`).dim(" • Time: ").red(`${time}\n`).dim(" • Save path: ").red(`${path}\n\x1b[?25h`).result()})
}

function showErrors({errors}) {
   const errorMessages = errors.map(error => AnsiColor.dim(` • "${error.url}" `).dim(`→ ${error.reason}`).red().result().replaceAll("\n", ""))

   showStatus({status: `${AnsiColor.red("Errors:").result().replaceAll("\n", "")}\n`})
   errorMessages.forEach((message, index) => process.stdout.write(index === errorMessages.length - 1 ? `${message}\n\n` : message))
}

export { showBanner, drawLine, showStatus, showSpinner, showProgress, showSummary, showErrors }