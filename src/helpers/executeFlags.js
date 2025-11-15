import { validFlags } from "../data/flags/index.js"

async function executeFlags({flags, subcommands}) {
   try {
      for (let key in flags) {
         const currentFlag = validFlags.find(item => (item.flag === key || item.alias.includes(key)))
         await currentFlag.action({flagName: key, subcommand: subcommands, value: flags[key]})
      }
   } catch (error) {
      throw error
   }
}

export { executeFlags }