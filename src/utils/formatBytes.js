function formatBytes(bytes) {
   if (typeof bytes !== "number") throw new Error(`Failed to format bytes, "bytes" must be a number`)

   const sizes = {KB: 1024, MB: 1024**2, GB: 1024**3, TB: 1024**4}

   if (bytes >= 1024**5) return `1000 TB`

   if (bytes >= sizes.TB) return `${(bytes / sizes.TB).toFixed(1)} TB`

   if (bytes >= sizes.GB) return `${(bytes / sizes.GB).toFixed(1)} GB`

   if (bytes >= sizes.MB) return `${(bytes / sizes.MB).toFixed(1)} MB`

   if (bytes >= sizes.KB) return `${(bytes / sizes.KB).toFixed(1)} KB`

   return `${bytes} B`
}

export { formatBytes }