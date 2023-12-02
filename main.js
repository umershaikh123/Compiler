const fs = require("fs")

class Lexer {
  constructor(inputFilePath, outputFilePath) {
    this.inputFilePath = inputFilePath
    this.outputFilePath = outputFilePath
    this.classification = {
      DT: ["void", "int", "bool", "double", "char", "string"],

      WDT: ["Integer", "Boolean", "Character", "String", "Double"],
      "=": ["="],
      RO: ["<", ">", "<=", ">=", "!=", "=="],
      MDM: ["*", "/", "%"],
      PM: ["+", "-"],
      implements: ["implements"],
      AO: ["+=", "-=", "*=", "/=", "%="],

      put: ["put"],

      if: ["if"],
      while: ["while"],
      do: ["do"],
      else: ["else"],
      for: ["for"],
      Switch: ["Switch"],
      case: ["case"],

      continue: ["continue"],
      AM0: ["Static"],
      break: ["break"],
      defaultBlock: ["defaultBlock"],
      public: ["public"],
      private: ["private"],

      default: ["default"],
      catch: ["catch"],
      throw: ["throw"],

      finally: ["finally"],
      try: ["try"],
      "{": ["{"],
      "}": ["}"],
      ";": [";"],
      ":": [":"],
      "(": ["("],
      ")": [")"],
      "[": ["["],
      "]": ["]"],
      ".": ["."],
      ",": [","],
      "=": ["="],
      extends: ["extends"],
      Integer: ["Integer"],

      $: ["$"],
      inc_dec_Op: ["++", "--"],

      "!": ["!"],
      "||": ["||"],
      "&&": ["&&"],

      add: ["add"],
      get: ["get"],
      set: ["set"],
      clear: ["clear"],
      remove: ["remove"],
      size: ["size"],
      put: ["put"],
      length: ["length"],
      Array: ["Array"],
      ArrayList: ["ArrayList"],
      HashMap: ["HashMap"],
      abstract: ["abstract"],
      interface: ["interface"],

      main: ["main"],
      class: ["class"],
      new: ["new"],

      inherits: ["inherits"],

      INVALID: ["INVALID"],
    }
    this.tokens = []
    this.reservedWords = new Set([
      "Main",
      "final",
      "print",
      "If",
      "else",
      "static",
      "void",
      "int",
      "char",
      "string",
      "double",
      "boolean",
      "new",
      "function",
      "switch",
      "case",
      "default",
      "break",
      "continue",
      "for",
      "while",
      "Array",
      "ArrayList",
      "Map",
      "public",
      "private",

      "abstract",
      "interface",
      "import",
      "inherits",
      "implements",
    ])
  }

  getClassPart(word) {
    for (const classPart in this.classification) {
      if (this.classification[classPart].includes(word)) {
        return classPart
      }
    }
    const isCharValid = /^'([^'\\]|\\[btnfr\\'"nrt])'$/.test(word)
    const isFloat = /^[-+]?\d+(\.\d+)?$/.test(word)
    const isInteger = /^[-+]?\d+$/.test(word)
    if (isInteger) {
      return "int_const"
    }
    if (!isNaN(parseFloat(word))) {
      return "double_const"
    }

    if (isCharValid) {
      return "char_const"
    }

    if (/^"([^\\"]|\\.)+"$/.test(word)) {
      return "str_const"
    }

    // Check if the token is an identifier based on the rules
    if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(word)) {
      return "ID"
    }

    return "INVALID"
  }

  splitTokensConsideringQuotes(line, lineNumber) {
    const tokens = []
    let currentToken = ""
    let insideQuotes = false
    let quoteType = ""

    for (let i = 0; i < line.length; i++) {
      const char = line[i]

      if (char === '"' || char === "'") {
        if (insideQuotes && quoteType === char) {
          tokens.push(quoteType + currentToken + quoteType)
          currentToken = ""
          insideQuotes = false
        } else if (!insideQuotes) {
          quoteType = char
          insideQuotes = true
        }
      } else if (!insideQuotes) {
        if (/[\s;,\(\){}\[\].]/.test(char)) {
          if (currentToken !== "") {
            tokens.push(currentToken)
            currentToken = ""
          }
          tokens.push(char)
        } else {
          currentToken += char
        }
      } else {
        currentToken += char
      }
    }

    if (!insideQuotes) {
      tokens.push(currentToken)
    }
    const processedTokens = []
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]
      if (token === ".") {
        const prevToken = processedTokens.pop()
        const nextToken = tokens[i + 1]
        const isPrevNumeric = !isNaN(prevToken)
        const isNextNumeric = !isNaN(nextToken)
        if (isPrevNumeric && isNextNumeric) {
          const floatPart = prevToken + "." + nextToken
          const isValidFloat = /^\d+(\.\d+)?$/.test(floatPart)
          if (isValidFloat) {
            processedTokens.push(floatPart)
            i++ // Skip the next token as it's part of the float
          } else {
            processedTokens.push(prevToken)
            processedTokens.push(token)
          }
        } else {
          processedTokens.push(prevToken)
          processedTokens.push(token)
        }
      } else {
        const hasNumeric = /\d/.test(token)
        const hasAlphabetic = /[a-zA-Z]/.test(token)
        if (hasNumeric && hasAlphabetic) {
          processedTokens.push("INVALID")
        } else {
          processedTokens.push(token)
        }
      }
    }

    const resultTokens = processedTokens.map((token, index) => {
      if (token === "INVALID") {
        return { value: token, class: "INVALID", line: lineNumber + 1 }
      }
      const classPart = this.getClassPart(token)
      return { value: token, class: classPart, line: lineNumber + 1 }
    })

    console.log("resultTokens = ", resultTokens)
    return resultTokens.filter(token => token.class !== "INVALID")
  }
  tokenize() {
    const inputFileContent = fs.readFileSync(this.inputFilePath, "utf-8")
    let lines = inputFileContent.split(/\r?\n/)
    console.log("Lines = ", lines, "\n")
    let insideMultilineComment = false
    for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
      let line = lines[lineNumber].trim()

      // Handle multiline comments
      if (insideMultilineComment) {
        const endIndex = line.indexOf("*#")
        if (endIndex !== -1) {
          line = line.substring(endIndex + 2) // Remove the comment end and continue with the rest of the line
          insideMultilineComment = false
        } else {
          continue // Skip this line entirely as it's inside a multiline comment
        }
      }

      // Check for multiline comment start and end
      const multilineCommentStartIndex = line.indexOf("#*")
      if (multilineCommentStartIndex !== -1) {
        const multilineCommentEndIndex = line.indexOf(
          "*#",
          multilineCommentStartIndex + 2
        )
        if (multilineCommentEndIndex !== -1) {
          // Remove the entire multiline comment from the line
          line =
            line.substring(0, multilineCommentStartIndex) +
            line.substring(multilineCommentEndIndex + 2)
        } else {
          // Multiline comment continues onto the next line
          line = line.substring(0, multilineCommentStartIndex)
          insideMultilineComment = true
        }
      }

      // Remove single line comments starting with '#'
      const lineWithoutSingleLineComments = line.split("#")[0].trim()
      console.log(
        "lineWithoutSingleLineComments= ",
        lineWithoutSingleLineComments,
        "\n"
      )
      const tokensInLine = this.splitTokensConsideringQuotes(
        lineWithoutSingleLineComments,
        lineNumber
      )

      // Split the token into float or identifier parts

      console.log("line = ", line, "\n")
      console.log("tokensInLine = ", tokensInLine, "\n")

      if (tokensInLine.length > 0) {
        this.tokens.push(...tokensInLine)

        continue
      }

      for (const token of tokensInLine) {
        const cleanedToken = token.trim()
        if (cleanedToken === "") {
          continue
        }
        console.log("cleanedToken = ", cleanedToken, "\n")

        let classPart = this.getClassPart(cleanedToken)

        if (!isNaN(cleanedToken)) {
          // Check if the token is a number
          if (Number.isInteger(parseFloat(cleanedToken))) {
            classPart = "INT"
            this.tokens.push({
              value: cleanedToken,
              class: classPart,
              line: lineNumber + 1,
            })
            continue
          }
        } else if (["true", "false"].includes(cleanedToken.toLowerCase())) {
          classPart = "bool_const"
        } else if (
          classPart === "str_const" &&
          cleanedToken.startsWith('"') &&
          cleanedToken.endsWith('"')
        ) {
          // Handle string tokens
          if (cleanedToken.startsWith('"') && cleanedToken.endsWith('"')) {
            const stringValue = cleanedToken.slice(1, -1) // Remove the double quotes
            this.tokens.push({
              value: stringValue,
              class: classPart,
              line: lineNumber + 1,
            })
          } else {
            // Invalid string token (missing quotes), skip it
            continue
          }
        } else if (classPart === "CHAR" && cleanedToken.length < 4) {
          // Remove single quotes and include escape sequences in tokens
          let charValue = cleanedToken.slice(1, -1)
          // Remove the single quotes

          charValue = charValue.replace(
            /\\(['"\\])|(\\[btnfrnrt])/g,
            (match, p1, p2) => {
              if (p1) {
                // Remove the quotes for single quotes, double quotes, or backslash
                return p1
              } else if (p2) {
                // Return the unescaped escape sequence
                const escapeMap = {
                  "\\b": "\b",
                  "\\t": "\t",
                  "\\n": "\n",
                  "\\f": "\f",
                  "\\r": "\r",
                }
                return escapeMap[p2] || p2
              }
            }
          )

          console.log("charValue", charValue)
          if (charValue.length <= 2) {
            this.tokens.push({
              value: charValue,
              class: classPart,
              line: lineNumber + 1,
            })
          } else {
            // Invalid char token, skip it
            continue
          }
        } else {
          this.tokens.push({
            value: cleanedToken,
            class: classPart,
            line: lineNumber + 1,
          })
        }
      }
    }

    console.log("Tokens : ", this.tokens)
  }

  writeTokensToFile() {
    const outputContent = this.tokens
      .map(token => `( ${token.value} , ${token.class}, LineNo: ${token.line})`)
      .join("\n")

    const endToken = `( $ , $, Line: ${
      this.tokens[this.tokens.length - 1].line + 1
    })`
    const finalOutput = outputContent + "\n" + endToken

    fs.writeFileSync(this.outputFilePath, finalOutput)
    console.log(
      "Lexical analysis completed. Tokens written to",
      this.outputFilePath
    )
  }
}
const lexer = new Lexer("input.txt", "output.txt")
lexer.tokenize()

lexer.writeTokensToFile()

const Grammar = {
  "<Start>": [
    ["<ClassDecl>", "<Start>"],
    ["<Interface_Dec>", "<Start>"],

    ["$"],
  ],
  //Class:
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
    ],
  ],
  "<Extra>": [
    ["extends", "<InterfaceIDList>"],
    ["implements", "<InterfaceIDList>"],
    ["null"],
  ],

  "<InterfaceIDList>": [["ID", "<listID>"]],
  "<listID>": [[",", "ID", "<listID>"], ["null"]],
  "<ClassBody>": [
    ["<AM>", "<ClassBodyDecl>", "<ClassBody>"],

    // ["<array_use>", "<ClassBody>"],
    ["null"],
  ],
  "<ClassBodyDecl>": [
    ["ID", "<Func>"],
    [
      // ["ID", "(", "<Parameters>", ")", "<C>"],
      "<L>",
    ],
    ["<abstract_fun>"],
    ["AM0", "<STF>"],
    // ["null"],
  ],

  "<STF>": [["ID", "<func_St>"], ["<L>"], ["<Main_Func>"]],
  "<Func>": [
    ["(", "<Parameters>", ")", "<C>"],
    // ["AM0", "<func_St>"],
  ],
  "<C>": [
    ["{", "<Body>", "}"],
    [":", "DT", "{", "<Body>", "}"],
  ],
  "<L>": [
    // ["<abstract_fun>"],
    // ["<Main_Func>"],
    ["<Attributes>"],
  ],
  "<Parameters>": [["DT", "ID", "<parameter_list>"], ["null"]],
  "<parameter_list>": [[",", "DT", "ID", "<parameter_list>"], ["null"]],
  // "<Parameters>": [["<Parameter>"], ["<parameter_list>"], ["null"]],
  // "<parameter_list>": [[",", "<Parameter>", "<parameter_list>"], ["null"]],
  // "<Parameter>": [["DT", "ID"]],
  "<Main_Func>": [["main", "(", ")", "{", "<Body>", "}"]],
  "<Attributes>": [["DT", "<A>"], ["<ArrayList>"], ["<HashMap>"]],
  "<A>": [["<Var>"], ["<Arrays>"]],
  "<abstract_fun>": [
    ["abstract", "ID", "(", "<Parameters>", ")", ":", "DT", ";"],
  ],
  "<AM>": [["public"], ["private"]],
  // "<AM0>": [["Static"]],
  "<ClassAccMod>": [["public"], ["private"], ["default"]],
  "<ClassNonAccMod>": [["final"], ["abstract"], ["null"]],

  //Body:
  "<Body>": [["<MST>"], ["null"]],
  "<SST>": [
    ["<AM_st>"],
    ["<While_St>"],
    ["<if_else>"],
    ["<Do_while_St>"],
    ["<for_St>"],
    ["<Switch_St>"],
    ["<try_catch_block>"],
    ["ID", "<S>"],
    ["DT", "ID", "<EQ>", "<assign_right>", ";"],
  ],

  "<EQ>": [["AO"], ["="]],

  "<S>": [
    [".", "<S2>", ";"],
    ["[", "int_const", "]", "<array_change_value>"],
    ["<Obj_dec>"],
    // ["<func_call>"],
  ],
  "<S2>": [
    ["<D1>"],

    //  ["<assign_st>"]
  ],
  "<AM_st>": [["<AM>", "<NS>"]],
  "<NS>": [["AM0", "<ST>"], ["<ST>"]],
  "<ST>": [["<Attributes>"]],
  "<MST>": [["<SST>", "<MST>"], ["null"]],

  //Var Dec+Init:
  "<Var>": [["ID", "<V>"]],
  "<V>": [["<Var_Dec>"], ["<EQ>", "<V2>"]],
  "<Var_Dec>": [[",", "ID", "<Var_Dec>"], [";"]],
  "<V2>": [["<assign_right>", ";"]],

  //While loop:
  "<While_St>": [["while", "(", "<OE>", ")", "{", "<Body>", "}"]],

  //Do_While:
  "<Do_while_St>": [["do", "{", "<Body>", "}", "while", "(", "<OE>", ")", ";"]],

  //If_Else:
  "<if_else>": [
    ["if", "(", "<OE>", ")", "{", "<Body>", "}", "<O_if_Else>", "<O_Else>"],
  ],
  "<O_if_Else>": [["else if", "(", "<OE>", ")", "{", "<Body>", "}"], ["null"]],
  "<O_Else>": [["else", "{", "<Body>", "}"], ["null"]],

  //for St
  "<for_St>": [
    ["for", "(", "DT", "<Var>", "<F2>", "<F3>", ")", "{", "<Body>", "}"],
  ],
  "<F2>": [["<OE>"], ["null"]],
  "<F3>": [
    ["ID", "<F4>"],
    ["inc_dec_Op", "ID"],
  ],
  "<F4>": [
    // ["inc_dec_Op", ";"],
    ["inc_dec_Op"],
    ["A0", "<assign_right>"],
  ],

  //Inc_Dec OP:
  "<inc_dec_Op>": [["++"], ["--"]],

  //Assignment_St:
  "<assign_st>": [["<assign_left>", "<EQ>", "<assign_right>"]],
  "<assign_left>": [["DT", "ID"], ["null"]],
  "<assign_right>": [["<OE>", "<Z>"]],
  "<Z>": [[".", "<D1>"], ["null"]],

  //func St:
  "<func_St>": [["(", "<Parameters>", ")", ":", "DT", "{", "<Body>", "}"]],
  //   "<Parameters>": [["<Parameter>"], ["<parameter_list>"], ["null"]],
  //   "<parameter_list>": [[",", "<Parameter>", "<parameter_list>"], ["null"]],
  //   "<Parameter>": [["DT", "ID"]],

  //Func Call:
  "<func_call>": [["(", "<AL>", ")"]],
  "<Arguments>": [["<OE>"]],

  //Switch:
  "<Switch_St>": [["Switch", "(", "<OE>", ")", "{", "<case_blocks>", "}"]],
  "<case_blocks>": [
    ["<case_block>", "<case_blocks>"],
    ["<default_block>"],
    ["null"],
  ],
  "<case_block>": [["case", "<const>", ":", "<Body>", "break", ";"]],
  "<default_block>": [["default", ":", "<Body>", "break", ";"]],

  //Exception/Try Catch:
  "<try_catch_block>": [
    ["try", "{", "<body>", "}", "<catch_block>", "<finally_block>"],
  ],
  "<catch_block>": [
    ["catch", "(", "<except_type>", "<except_Var>", ")", "{", "<body>", "}"],
  ],
  "<finally_block>": [["{", "<body>", "}"], ["null"]],
  "<except_type>": [["<IC>"]],
  "<IC>": [["ID"], ["<const>"]],

  //Interface Class:
  "<Interface_Dec>": [["interface", "ID", "{", "<Interface_Body>", "}"]],
  "<Interface_Body>": [["public", "<NT>", "<Interface_Body>"], ["null"]],
  "<NT>": [["<Interface_Var_Init>"], ["<Fun_Head>"]],
  "<Interface_Var_Init>": [["AM0", "<Init>"], ["<Init>"]],
  "<Init>": [["DT", "ID", "<EQ>", "<const>", ";"]],
  "<Fun_Head>": [["ID", "(", "<Parameters>", ")", ":", "DT", ";"]],

  //Class Obj_dec:
  "<Obj_dec>": [["ID", "<O1>"]],
  "<O1>": [[";"], ["=", "new", "ID", "(", "<AL>", ")", ";"]],
  "<Next_Arguments>": [["<Arguments>", "<listA>"]],
  "<listA>": [[",", "<Arguments>", "<list>"], ["null"]],
  // "<InterfaceIDList>": [["ID", "<listID>"]],
  // "<listID>": [[",", "ID", "<listID>"], ["null"]],
  // "<Mult_Arguments>" : [[""] , ""]

  //Dot:
  "<Dot_st>": [["ID", ".", "<D1>"]],
  "<D1>": [
    ["<Object_operations>"],

    ["<Common_operations>"],

    ["<ArrayList_operations>"],

    ["<HashMap_operation>"],

    ["<array_operations>"],
    ,
    ["<func_call>", ";"],
  ],
  "<Object_operations>": [["ID", "<Object_operations_tail>"]],
  "<Object_operations_tail>": [
    ["<func_call>", ";"],
    ["<EQ>", "<assign_right>", ";"],
    ["null"],
  ],
  "<array_operations>": [["length"]],
  "<Common_operations>": [
    ["<get_operation>"],
    ["<remove_operation>"],
    ["<clear_operation>"],
    ["<size_operation>"],
  ],
  "<get_operation>": [["get", "(", "<go>", ")"]],

  "<bsc_const>": [["bool_const"], ["string_const"], ["char_const"]],
  "<remove_operation>": [["remove", "(", "<go>", ")"]],
  "<clear_operation>": [["clear", "(", ")"]],
  "<size_operation>": [["size", "(", ")"]],
  "<index>": [["int_const"]],
  "<go>": [["<index>"], ["<bsc_const>"]],
  "<ArrayList_operations>": [["<add_operation>"], ["<set_operation>"]],
  "<add_operation>": [["add", "(", "<OE>", ")"]],
  "<set_operation>": [["set", "(", "<index>", ",", "<const>", ")"]],

  "<HashMap_operation>": [["<put_operation>"]],
  "<put_operation>": [["put", "(", "<const>", ",", "<const>", ")"]],

  "<const>": [
    ["int_const"],
    ["bool_const"],
    ["str_const"],
    ["char_const"],
    ["double_const"],
  ],

  //Expression:
  "<OE>": [["<AE>", "<OE_prime>"]],
  "<OE_prime>": [["||", "<AE>", "<OE_prime>"], ["null"]],
  "<AE>": [["<R>", "<AE_prime>"]],
  "<AE_prime>": [["&&", "<R>", "<AE_prime>"], ["null"]],
  "<R>": [["<E>", "<R_prime>"]],
  "<R_prime>": [["RO", "<E>", "<R_prime>"], ["null"]],
  "<E>": [["<T>", "<E_prime>"]],
  "<E_prime>": [["PM", "<T>", "<E_prime>"], ["null"]],
  "<T>": [["<F>", "<T_prime>"]],
  "<T_prime>": [["MDM", "<F>", "<T_prime>"], ["null"]],
  "<F>": [["<P>", "ID", "<F1>"], ["<const>", ";"], ["!", "<F>"], ["null"]],
  "<F1>": [
    ["[", "<OE>", "]", "<F1>"],
    ["(", "<AL>", ")", "<F5>"],
    [".", "ID", "<F1>"],
    ["inc_dec_Op"],
    ["null"],
  ],
  "<F5>": [[".", "ID", "<F1>"], ["[", "<OE>", "]", "<F1>"], ["null"]],
  "<AL>": [["<Argument>", "<Next_Argument>"], ["null"]],
  "<Argument>": [["<OE>"]],
  "<Next_Argument>": [[",", "<OE>"], ["null"]],
  "<P>": [["this", "."], ["null"]],

  //Arrays;
  "<Arrays>": [["[", "]", "ID", "<list>", "<array_init>"]],
  "<list>": [[",", "ID", "<list>"], ["null"]],
  "<array_init>": [[";"], ["<EQ>", "<AI>"]],
  "<AI>": [
    ["{", "<list_values>", "}", ";"],
    ["new", "DT", "[", "int_const", "]", ";"],
  ],
  "<list_values>": [
    ["<const>", "<list_values>"],
    [",", "<const>", "<list_values>"],
    ["null"],
  ],
  "<array_use>": [["ID", "[", "int_const", "]", "<array_change_value>"]],
  "<array_change_value>": [[";"], ["<EQ>", "<const>", ";"]],

  //List:
  // "<WDT>": [["Integer"], ["String"], ["Boolean"], ["Float"], ["Character"]],
  "<ArrayList>": [
    [
      "ArrayList",
      "[",
      "WDT",
      "]",
      "ID",
      "=",
      "new",
      "ArrayList",
      "[",
      "WDT",
      "]",
      ";",
    ],
  ],

  //HashMap:
  "<HashMap>": [
    [
      "HashMap",

      "[",
      "WDT",
      ",",
      "WDT",
      "]",

      "ID",
      "=",
      "new",
      "HashMap",

      "[",
      "WDT",
      ",",
      "WDT",
      "]",

      ";",
    ],
  ],
}

// Read tokens from output.txt
const tokenData = fs.readFileSync("output.txt", "utf8")
console.log(" tokenData ", tokenData)
const tokens = tokenData
  .split("\n")
  .map(line => {
    const matches = line.match(/\(([^,]+), ([^,]+), LineNo: (\d+)\)/)
    if (matches && matches.length === 4) {
      const [, valuepart, classpart, lineNo] = matches
      return {
        valuepart: valuepart.trim(),
        classpart: classpart.trim(),
        lineNo,
      }
    } else if (line.includes("( $ , $, Line: ")) {
      return {
        valuepart: "$",
        classpart: "$",
        lineNo: parseInt(line.match(/Line: (\d+)/)[1]),
      }
    } else if (line.includes("( , , ,, LineNo: ")) {
      return {
        valuepart: ",",
        classpart: ",",
        lineNo: parseInt(line.match(/LineNo: (\d+)/)[1]),
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
  const startSymbol = "<Start>"
  if (parseNonTerminal(startSymbol)) {
    console.log("Successfully parsed the input.")
  } else {
    console.log("Failed to parse the input.")
  }
}

// Start parsing

// Usage

parse()
