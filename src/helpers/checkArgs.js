import { validFlags } from "../data/flags/index.js"

function checkArgs({args}) {
   let verifiedIndexes = []

   const argsObj = args.reduce((acc, cur, index) => {
      if (index === 0) {
         updateAccAndIndexes({acc: acc, accKey: "node", accValue: {exe: cur, filePath: args[index + 1]}, indexesArr: verifiedIndexes, indexes: [index, index + 1]})
         return acc
      }

      if (cur.startsWith("https://vt.tiktok.com")) {
         updateAccAndIndexes({acc: acc, accKey: "args", accValue: {...acc.args, urls: [...acc.args.urls, cur]}, indexesArr: verifiedIndexes, indexes: index})
         return acc
      }

      if (validFlags.some(item => (item.subcommand && item.subcommand.includes(cur)))) {
         updateAccAndIndexes({acc: acc, accKey: "args", accValue: {...acc.args, subcommands: [...acc.args.subcommands, cur]}, indexesArr: verifiedIndexes, indexes: index})
         return acc
      }

      if (cur.startsWith("-")) {
         const foundFlag = validFlags.find(item => (item.flag === cur || item.alias.includes(cur)))

         if (foundFlag) {
            updateAccAndIndexes({acc: acc, accKey: "flags", accValue: {...acc.flags, [cur]: foundFlag.takesValue ? args[index + 1] : ""}, indexesArr: verifiedIndexes, indexes: foundFlag.takesValue ? [index, index + 1] : index})
            acc.flags = Object.fromEntries(Object.entries(acc.flags).sort(([a], [b]) => /^(-h|--help)$/.test(a) ? -1 : /^(-h|--help)$/.test(b) ? 1 : b.localeCompare(a)))
            return acc
         }
      }

      if (!verifiedIndexes.includes(index)) {
         updateAccAndIndexes({acc: acc, accKey: "unknown", accValue: [...acc.unknown, cur], indexesArr: verifiedIndexes, indexes: index})
      }

      return acc
   }, {node: {}, args: {urls: [], subcommands: []}, flags: {}, unknown: []})
   
   return argsObj
}

function updateAccAndIndexes({acc, accKey, accValue, indexesArr, indexes}) {
   acc[accKey] = accValue
   Array.isArray(indexes) ? indexesArr.push(...indexes) : indexesArr.push(indexes)
}

export { checkArgs }