async function getVideoURLs({url}) {
   try {
      const HTMLResponse = await fetch("https://ttdownloader.com/")
      const cookie = HTMLResponse.headers.get("set-cookie")
      const tokenValue = (await HTMLResponse.text()).match(/value="\w+"/)[0]

      const videoResponse = await fetch("https://ttdownloader.com/search/", {
         method: "POST",
         headers: {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            origin: "https://ttdownloader.com",
            referer: "https://ttdownloader.com/",
            cookie: cookie
         },
         body: `url=${encodeURIComponent(url)}&format=&token=${tokenValue.slice(7, tokenValue.length - 1)}`
      })

      const videoURLs = (await videoResponse.text()).match(/<a.+?class="download-link".+?href=".+?">Download video<\/a>/g).reduce((acc, cur, index) => {
         const video = cur.match(/href=".+?"/)[0]
         return index === 0 ? acc = {...acc, no_wm: video.slice(6, video.length - 1)} : acc = {...acc, wm: video.slice(6, video.length - 1)}
      }, {no_wm: "", wm: ""})

      return videoURLs
   } catch (error) {
      throw new Error(`Failed to fetch URLs: ${error.message}`)
   }
}

export { getVideoURLs }