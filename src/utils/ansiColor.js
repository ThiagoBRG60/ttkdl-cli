import { ansiColorCodes } from "../data/ansiColorCodes.js"

class ColorText {
   #finalText = []

   #apply(color, text) {
      const lastItem = this.#finalText.length - 1

      if (!text) {
         this.#finalText.splice(lastItem, 1, `${ansiColorCodes[color]}${this.#finalText[lastItem]}${ansiColorCodes.reset}`)
      } else {
         this.#finalText.push(`${ansiColorCodes[color]}${text}${ansiColorCodes.reset}`)
      }

      return this
   }

   red(text) {
      return this.#apply("red", text)
   }

   lightBlue(text) {
      return this.#apply("lightBlue", text)
   }

   gray(text) {
      return this.#apply("gray", text)
   }

   white(text) {
      return this.#apply("white", text)
   }

   dim(text) {
      return this.#apply("dim", text)
   }

   bold(text) {
      return this.#apply("bold", text)
   }

   result() {
      const outputText = this.#finalText.join("")
      this.#finalText = []

      return `\n${outputText}\n`
   }
}

const AnsiColor = new ColorText()

export { AnsiColor }