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
      let videosSizes = {total: 0, current: 0}
      let downloadSpeed = {prev: 0, cur: 0}
      let downloadInfo = {finished: 0, current: 0, errors: []}
      const startTime = Date.now()
      const fetchingMessage = showSpinner()
      
      showBanner()

      for (let i = 0; i < urls.length; i += state.concurrentDownloads) {
         const slicedURLs = urls.slice(sliceIndexes.start, sliceIndexes.end)
         downloadInfo.current += slicedURLs.length
         
         fetchingMessage.start({label: "Fetching URLs...", current: downloadInfo.current, total: urls.length})
         const URLsResponses = await Promise.allSettled(slicedURLs.map(url => getVideoURLs({url: url})))
         
         URLsResponses.forEach((url, index) => {
            if (url.status === "rejected") downloadInfo.errors.push({url: slicedURLs[index], reason: "Invalid URL"})
         })

         fetchingMessage.cancel()

         if (downloadInfo.errors.length !== urls.length) {
            showStatus({status: AnsiColor.lightBlue("\n✓").gray(" URLs found.").result()})

            const videosResponses = await Promise.allSettled(URLsResponses.filter(res => res.status === "fulfilled").map(url => fetch(url.value.no_wm)))
            const hasContentLength = videosResponses.some(res => res.value.headers.get("content-length"))

            if (hasContentLength) videosSizes.total += videosResponses.reduce((acc, cur) => acc += parseInt(cur.value.headers.get("content-length")), 0)

            showStatus({status: AnsiColor.lightBlue("⬇").gray(" Downloading videos... ").dim(`(${downloadInfo.current}/${urls.length})\n`).gray().result()})

            const downloadSpeeds = []

            const intervalId = setInterval(() => {
               downloadSpeeds.push(downloadSpeed.cur)

               if (downloadSpeeds.length > 3) downloadSpeeds.shift()

               const average = downloadSpeeds.reduce((a, b) => a + b, 0) / downloadSpeeds.length
               downloadSpeed.prev = average
               downloadSpeed.cur = 0
            }, 1000)

            for (const video of videosResponses) {
               if (video.value) {
                  if (!existsSync(state.rootFolder)) mkdirSync(state.rootFolder, {recursive: true})
   
                  const readable = Readable.from(video.value.body)
                  const videoName = `tiktok_${crypto.randomUUID()}.mp4`
                  const writable = createWriteStream(join(state.rootFolder, videoName))

                  readable.on("data", (chunk) => {
                     const progressOptions = {videosSizes: videosSizes, downloadSpeed: formatBytes(downloadSpeed.prev)}

                     videosSizes.current += chunk.byteLength
                     downloadSpeed.cur += chunk.byteLength

                     showProgress(hasContentLength ? {...progressOptions, style: "progressBar", remainingTime: formatTime(videosSizes.total / downloadSpeed.prev)} : {...progressOptions, style: "text"})
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
   
                        clearInterval(intervalId)
                        downloadInfo.finished = 0
                        if (!hasContentLength) videosSizes.total += videosSizes.current
                        videosSizes.current = 0
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
      showStatus({status: `${downloadInfo.errors.length !== urls.length ? "\n" : ""}${AnsiColor.lightBlue("✓").gray(" Done.").result()}`})
      drawLine()
      showSummary({totalVideos: urls.length - downloadInfo.errors.length, errorsCount: downloadInfo.errors.length, totalSize: formatBytes(videosSizes.total), time: formatTime((endTime - startTime) / 1000), path: state.rootFolder})

      if (downloadInfo.errors.length > 0) showErrors({errors: downloadInfo.errors})
   } catch (error) {
      throw new Error(`Failed to download videos: ${error.message}`)
   }
}

export { downloadVideos }