function formatTime(seconds) {
   if (typeof seconds !== "number") throw new Error(`Failed to format time, "seconds" must be a number`)

   const time = {hours: 0, minutes: 0, seconds: 0}

   time.seconds = Math.floor(seconds % 60)

   if (seconds >= 60) {
      time.minutes = Math.floor(seconds / 60)
   }

   if (time.minutes >= 60) {
      time.minutes = Math.floor((seconds % 3600) / 60)
      time.hours = Math.floor(seconds / 3600)
   }

   if (time.hours >= 99) {
      return `99h 59m 59s remaining`
   }

   return `${time.hours !== 0 ? `${time.hours}h ` : ""}${time.minutes !== 0 ? `${time.minutes}m ` : ""}${time.seconds !== 0 ? `${time.seconds}s` : ""}`
}

export { formatTime }