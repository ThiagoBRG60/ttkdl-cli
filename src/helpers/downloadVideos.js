import { createWriteStream, existsSync, mkdirSync } from "node:fs"
import { Readable } from "node:stream"
import { join } from "node:path"
import { sleep } from "../utils/sleep.js"
import { getVideoURLs } from "./getVideoURLs.js"
import { state } from "../data/flags/state.js"
import { showBanner, drawLine, showStatus, showSpinner, showProgress, showSummary, showErrors } from "./cliDisplay.js"
import { AnsiColor } from "../utils/ansiColor.js"
import { formatBytes } from "../utils/formatBytes.js"
import { formatTime } from "../utils/formatTime.js"

const sleepFn = sleep()

async function downloadVideos({urls}) {
   try {
      let sliceIndexes = {start: 0, end: state.concurrentDownloads}
      let videosSize = {total: 0, current: 0}
      let downloadInfo = {finished: 0, current: 0, errors: []}
      const startTime = Date.now()
      const fetchingMessage = showSpinner()
      
      showBanner()

      for (let i = 0; i < urls.length; i += state.concurrentDownloads) {
         const slicedURLs = urls.slice(sliceIndexes.start, sliceIndexes.end)
         downloadInfo.current += slicedURLs.length
         
         fetchingMessage.start({label: "Fetching URLs...", current: downloadInfo.current, total: urls.length})
         const URLsResponses = await Promise.allSettled(slicedURLs.map(url => getVideoURLs({url})))
         URLsResponses.forEach((url, index) => {if (url.status === "rejected") downloadInfo.errors.push({url: slicedURLs[index], reason: "Invalid URL"})})
         fetchingMessage.cancel()

         if (slicedURLs.length !== downloadInfo.errors.length) {
            showStatus({status: AnsiColor.lightBlue("\n✓").gray(" URLs found.").result()})

            const videosResponses = await Promise.allSettled(URLsResponses.map(url => url.status === "fulfilled" && fetch(url.value.no_wm)))
            videosSize.total += videosResponses.reduce((acc, cur) => cur.value ? acc += parseInt(cur.value.headers.get("content-length")) : acc, 0)
            showStatus({status: AnsiColor.lightBlue("⬇").gray(" Downloading videos... ").dim(`(${downloadInfo.current}/${urls.length})\n`).result()})

            for (const video of videosResponses) {
               if (video.value) {
                  if (!existsSync(state.rootFolder)) mkdirSync(state.rootFolder, {recursive: true})
   
                  const readable = Readable.from(video.value.body)
                  const videoName = `tiktok_${crypto.randomUUID()}.mp4`
                  const writable = createWriteStream(join(state.rootFolder, videoName))
   
                  readable.on("data", (chunk) => {
                     videosSize.current += chunk.byteLength
                     showProgress({percent: Math.floor((videosSize.current / videosSize.total) * 100), downloadSpeed: formatBytes(chunk.byteLength), remainingTime: formatTime(videosSize.total / videosSize.current)})
                     writable.write(chunk)
                  })
   
                  readable.on("end", () => {
                     downloadInfo.finished += 1
                     writable.end()
   
                     if (downloadInfo.finished + downloadInfo.errors.length === slicedURLs.length) {
                        if (downloadInfo.current !== urls.length) {
                           process.stdout.moveCursor(0, -6)
                           process.stdout.clearScreenDown()
                        }
   
                        downloadInfo.finished = 0
                        sleepFn.cancel()
                     }
                  })
               }
            }

            await sleepFn.promise()
            sliceIndexes = {start: sliceIndexes.start + state.concurrentDownloads, end: sliceIndexes.end + state.concurrentDownloads}
         } else {
            showStatus({status: AnsiColor.red("\n✕").gray(" Failed to fetch URLs.").result()})
         }
      }

      const endTime = Date.now()
      showStatus({status: `${urls.length !== downloadInfo.errors.length ? "\n" : ""}${AnsiColor.lightBlue("✓").gray(" Done.").result()}`})
      drawLine()
      showSummary({totalVideos: urls.length - downloadInfo.errors.length, errorsCount: downloadInfo.errors.length, totalSize: formatBytes(videosSize.total), time: formatTime((endTime - startTime) / 1000), path: state.rootFolder})
      if (downloadInfo.errors.length > 0) showErrors({errors: downloadInfo.errors})
   } catch (error) {
      throw new Error(`Failed to download videos: ${error.message}`)
   }
}

export { downloadVideos }