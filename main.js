const fs = require("fs")

class Lexer {
  constructor(inputFilePath, outputFilePath) {
    this.inputFilePath = inputFilePath
    this.outputFilePath = outputFilePath
    this.classification = {
      DT: ["void", "int", "bool", "double", "char", "string"],
      // void: ["void"],
      WDT: ["Integer", "Boolean", "Character", "String", "Double"],
      RO: ["<", ">", "<=", ">=", "!=", "=="],
      MDM: ["*", "/", "%"],
      PM: ["+", "-"],
      Implements: ["Implements"],

      // CONST: [
      //   "int_const" ,
      //   "bool_const",
      //   "double_const",
      //   "char_const",
      //   "str_const",
      // ],
      // AM: ["public", "private"],

      // int_const: ["int_const"],
      // bool_const: ["bool_const"],
      // double_const: ["double_const"],
      // char_const: ["char_const"],
      // str_const: ["str_const"],
      if: ["if"],
      while: ["while"],
      do: ["do"],
      else: ["else"],
      for: ["for"],
      Switch: ["Switch"],
      case: ["case"],
      // default: ["default"],
      continue: ["continue"],
      AM0: ["Static"],
      break: ["break"],
      defaultBlock: ["defaultBlock"],
      public: ["public"],
      private: ["private"],
      // static : ["static"],
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
      // Boolean: ["Boolean"],
      // Double: ["Double"],
      // Character: ["Character"],
      // String: ["String"],
      $: ["$"],
      inc_dec_Op: ["++", "--"],
      // "int_const" : ["int_const"],
      // "bool_const" : ["bool_const"],
      // "double_const" : ["double_const"],
      // "char_const" : ["char_const"],
      // "str_const" : ["str_const"],
      "!": ["!"],
      " ||": [" ||"],
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
      // cb: ["continue", "break"],
      // return: ["return"],
      // void: ["void"],

      // boolean: ["boolean"],
      // string: ["string"],
      main: ["main"],
      class: ["class"],
      new: ["new"],
      // ClassAccMod: ["default"],
      // ClassNonAccMod: ["final"],

      // AM: ["public", "private"],
      // AMO: ["static"],
      // public : [""],
      // public : [""],
      // public : [""],
      // public : [""],
      // public : [""],
      // public : [""],
      // public : [""],

      // extra: ["extends", "Implements"],

      // import: ["import"],
      // function: ["function"],

      inherits: ["inherits"],
      // dot: ["."],
      // semi_colon: [";"],
      // Left_CurlyBrace: ["{"],
      // Right_CurlyBrace: ["}"],
      // comma: [","],
      // BACKSLASH: ["/"],
      // "/$_CLASS": ["/$"],
      // "$/_CLASS": ["$/"],
      // Left_parenthesis: ["("],
      // Right_parenthesis: [")"],
      // COLON: [":"],
      // Left_braket: ["["],
      // Right_braket: ["]"],

      // "*_CLASS": ["*", "/", "%"],
      // "+_CLASS": ["+", "-"],
      // OP_CLASS: ["<", ">", "<=", ">=", "!=", "=="],
      // "=_CLASS": ["="],
      // AND_CLASS: ["&&"],
      // OR_CLASS: ["||"],
      // NOT_CLASS: ["!"],
      // INC_DEC: ["++", "--"],
      ASSIGN_OP: ["+=", "-=", "*=", "/=", "%="],
      // BINARY_OP: [
      //   "+=",
      //   "-=",
      //   "*=",
      //   "/=",
      //   "%=",
      //   "<=",
      //   ">=",
      //   "!=",
      //   "==",
      //   "&&",
      //   "||",
      //   "++",
      //   "--",
      // ],
      // UNIARY_OP: ["!", "=", "<", ">", "+", "-", "*", "/", "%"],

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
    // if (isFloat) {
    //   return "FLOAT"
    // }
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

  // splitTokensConsideringQuotes(line, lineNumber) {
  //   const tokens = []
  //   let currentToken = ""
  //   let insideQuotes = false
  //   let quoteType = ""

  //   for (let i = 0; i < line.length; i++) {
  //     const char = line[i]

  //     if (char === '"' || char === "'") {
  //       if (insideQuotes && quoteType === char) {
  //         tokens.push(quoteType + currentToken + quoteType)
  //         currentToken = ""
  //         insideQuotes = false
  //       } else if (!insideQuotes) {
  //         quoteType = char
  //         insideQuotes = true
  //       }
  //     } else if (!insideQuotes) {
  //       if (/[\s;,\(\){}\[\].]/.test(char)) {
  //         if (currentToken !== "") {
  //           tokens.push(currentToken)
  //           currentToken = ""
  //         }
  //         tokens.push(char)
  //       } else {
  //         currentToken += char
  //       }
  //     } else {
  //       currentToken += char
  //     }
  //   }

  //   if (!insideQuotes) {
  //     tokens.push(currentToken)
  //   }

  //   const processedTokens = []
  //   for (let i = 0; i < tokens.length; i++) {
  //     const token = tokens[i]
  //     if (token === ".") {
  //       const prevToken = processedTokens.pop()
  //       const nextToken = tokens[i + 1]
  //       if (!isNaN(prevToken) && !isNaN(nextToken)) {
  //         processedTokens.push(prevToken + "." + nextToken)
  //         i++ // Skip the next token as it's part of the float
  //       } else {
  //         processedTokens.push(prevToken)
  //         processedTokens.push(token)
  //       }
  //     } else {
  //       processedTokens.push(token)
  //     }
  //   }

  //   console.log("processedTokens= ", processedTokens)
  //   return processedTokens.map((token, index) => {
  //     return {
  //       value: token,
  //       class: this.getClassPart(token),
  //       line: lineNumber + 1, // Adjust the line number as needed
  //     }
  //   })
  // }

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

    // const resultTokens = processedTokens.map((token, index) => {
    //   const classPart = this.getClassPart(token)
    //   if (classPart === "IDENTIFIER" && /\d/.test(token)) {
    //     return { value: token, class: "INVALID", line: lineNumber + 1 }
    //   }
    //   return { value: token, class: classPart, line: lineNumber + 1 }
    // })
    // return resultTokens.filter(token => token.class !== "INVALID")

    // console.log("processedTokens= ", processedTokens)
    // return processedTokens.map((token, index) => {
    //   return {
    //     value: token,
    //     class: this.getClassPart(token),
    //     line: lineNumber + 1,
    //   }
    // })
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

        // console.log("!isNaN(cleanedToken) ", !isNaN(cleanedToken))
        // console.log(
        //   "Number.isInteger(parseFloat(cleanedToken))",
        //   Number.isInteger(parseFloat(cleanedToken))
        // )

        // const splitToken = cleanedToken.split(/\./)

        // for (let i = 0; i < splitToken.length; i++) {
        //   const tokenPart = splitToken[i]
        //   const classPart = this.getClassPart(tokenPart)
        //   this.tokens.push({
        //     value: tokenPart,
        //     class: classPart,
        //     line: lineNumber + 1,
        //   })

        // }
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

// Usage
const lexer = new Lexer("input.txt", "output.txt")
lexer.tokenize()

lexer.writeTokensToFile()

// remove white space , add , :
// if (/[\s;,\(\){}\[\]\.\s]/.test(char)) {
//   if (currentToken !== "") {
//     tokens.push(currentToken)
//     currentToken = ""
//   }
//   if (/[\s;,\(\){}\[\]\.\s]/.test(char)) {
//     tokens.push(char)
//   }
// }

// Breakers
// \s+: This matches one or more whitespace characters, including spaces, tabs, and newlines.
// ;: This matches the semicolon character.
// ,: This matches the comma character.
// \(: This matches the opening parenthesis character.
// \): This matches the closing parenthesis character.
// {: This matches the opening curly brace character.
// }: This matches the closing curly brace character.
// \]: This matches the closing square bracket character.
// \[: This matches the opening square bracket character.
// ": This matches the double quotation mark character.
// ': This matches the single quotation mark character.
// \.: This matches the period character.
// \s*: This matches zero or more whitespace characters (spaces, tabs).

// writeTokensToFile() {
//   const outputContent = this.tokens
//     .map(token => `( ${token.value} , ${token.class}, LineNo: ${token.line})`)
//     .join("\n")
//   fs.writeFileSync(this.outputFilePath, outputContent)
//   console.log(
//     "Lexical analysis completed. Tokens written to",
//     this.outputFilePath
//   )
// }
