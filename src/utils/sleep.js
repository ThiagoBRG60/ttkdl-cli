function sleep() {
   let resolveFn

   return {
      promise: () => new Promise(resolve => resolveFn = resolve),
      cancel: () => resolveFn()
   }
}

export { sleep }