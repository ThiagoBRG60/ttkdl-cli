import { validFlags } from "../data/flags/index.js"

function checkSubcommands({subcommands, flagKeys}) {
   subcommands.forEach(command => {
      const subcommandsFlag = validFlags.find(item => item.subcommand && item.subcommand.includes(command))
      const flagNames = [subcommandsFlag.flag, ...subcommandsFlag.alias]
      let error = ""

      for (let i = 0; i < flagNames.length; i++) {
         if (flagKeys.includes(flagNames[i])) break

         if (i === flagNames.length - 1) {
            error = `The "${command}" subcommand requires one of the following options: ${flagNames.map((name, i) => flagNames.length > 2 ? (i === flagNames.length - 2 ? `"${name}"` : i !== flagNames.length - 1 ? `"${name}",` : `or "${name}"`) : (i !== flagNames.length - 1 ? `"${name}"` : `or "${name}"`)).join(" ")}`
         }
      }

      if (error) throw new Error(error)
   })
}

export { checkSubcommands }