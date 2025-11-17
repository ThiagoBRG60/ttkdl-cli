import { handleHelpFlag } from "./handlers/help.js"
import { handleChangePathFlag } from "./handlers/changePath.js"
import { handleMaxFlag } from "./handlers/max.js"
import { handleVersionFlag } from "./handlers/version.js"
import { state } from "./state.js"

const validFlags = [
   {
      flag: "--help",
      takesValue: false,
      alias: ["-h"],
      action: () => handleHelpFlag()
   },
   {
      flag: "--root",
      takesValue: true,
      subcommand: ["config"],
      alias: ["-r"],
      action: ({flagName, subcommand, value}) => handleChangePathFlag({flagName, subcommand, value})
   },
   {
      flag: "--output",
      takesValue: true,
      alias: ["-o"],
      action: ({flagName, value}) => handleChangePathFlag({flagName, value})
   },
   {
      flag: "--max",
      takesValue: true,
      alias: ["-m"],
      action: ({flagName, value}) => handleMaxFlag({flagName, value})
   },
   {
      flag: "--yes",
      takesValue: false,
      alias: ["-y"],
      action: () => state.confirmFlag = "yes"
   },
   {
      flag: "--version",
      takesValue: false,
      alias: ["-v"],
      action: () => handleVersionFlag()
   }
]

export { validFlags }