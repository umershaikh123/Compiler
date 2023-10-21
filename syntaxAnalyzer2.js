const Grammar = {
  "<ClassDecl>": [
    [
      "<ClassAccMod>",
      "<ClassNonAccMod>",
      "class",
      "ID",
      "<Extra>",
      "{",
      "<ClassBody>",
      "}",
      "$",
    ],
  ],
  "<Extra>": [["extends"], ["Implements"], ["null"]],
  "<ClassBody>": [["<AM>", "<ClassBody>"], ["null"]],
  "<ClassAccMod>": [["public"], ["private"], ["default"]],
  "<ClassNonAccMod>": [["final"], ["abstract"], ["null"]],
  "<AM>": [["public"], ["private"]],
}
const fs = require("fs")

// Read tokens from output.txt
const tokenData = fs.readFileSync("output.txt", "utf8")
console.log(" tokenData ", tokenData)

const tokens = tokenData
  .split("\n")
  .map(line => {
    const matches = line.match(/\(([^,]+), ([^,]+), LineNo: (\d+)\)/)
    if (matches && matches.length === 4) {
      const [, valuepart, classpart, lineNo] = matches
      return { valuepart, classpart, lineNo }
    } else if (line.includes("( $ , $, Line: ")) {
      return {
        valuepart: "$",
        classpart: "$",
        lineNo: parseInt(line.match(/Line: (\d+)/)[1]),
      }
    }
    return null
  })
  .filter(token => token !== null)
let tokenIndex = 0

console.log("tokens ", tokens)
// console.log("tokens[0].classpart", tokens[0].classpart)
function parseNonTerminal(nonTerminal) {
  console.log(`Parsing non-terminal: ${nonTerminal}`)
  const productionRule = Grammar[nonTerminal]

  if (Array.isArray(productionRule)) {
    for (const rule of productionRule) {
      console.log(`Checking production rule: ${rule}`)
      let ruleIndex = 0
      let failed = false
      for (const symbol of rule) {
        if (symbol.startsWith("<")) {
          // It's a non-terminal
          console.log(`Processing non-terminal: ${symbol}  \n`)
          if (!parseNonTerminal(symbol)) {
            failed = true
            break
          }
        } else if (symbol !== "null") {
          // It's a terminal
          const currentToken = tokens[tokenIndex]
          console.log("currentToken", currentToken)
          //   console.log("currentToken.classpart", currentToken.classpart)
          if (currentToken && currentToken.classpart === symbol) {
            console.log(`Matched ${symbol}  \n`)
            tokenIndex++
          } else {
            console.log(
              `Failed to match ${symbol} at line ${currentToken.lineNo}  \n`
            )
            failed = true
            break
          }
        }
        ruleIndex++
      }
      if (!failed) {
        return true // Successfully parsed the production rule
      }
    }
  }

  return false // All production rules failed
}

function parse() {
  const startSymbol = "<ClassDecl>"
  if (parseNonTerminal(startSymbol)) {
    console.log("Successfully parsed the input.")
  } else {
    console.log("Failed to parse the input.")
  }
}

// Start parsing
parse()
