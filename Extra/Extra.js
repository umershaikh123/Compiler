const fs = require("fs")

class Lexer {
  constructor(inputFilePath, outputFilePath) {
    this.inputFilePath = inputFilePath
    this.outputFilePath = outputFilePath
    this.classification = {
      DT: ["int", "char", "double", "string", "char"],
      IF: ["if"],
      WHILE: ["while"],
      DO: ["do"],
      ELSE: ["else"],
      FOR: ["for"],
      SWITCH: ["switch"],
      CASE: ["case"],
      DEFAULT: ["default"],
      CB: ["continue", "break"],
      RETURN: ["return"],
      VOID: ["void"],
      MAIN: ["main"],
      ABSTRACT: ["abstract"],
      BOOLEAN: ["boolean"],
      STRING: ["string"],
      CLASS: ["class"],
      NEW: ["new"],
      ACCESS_MODIFIER: ["private", "public"],
      STATIC: ["static"],

      // 'PRINT': ['print'],
      EXTENDS: ["extends"],
      IMPLEMENTS: ["implements"],
      INTERFACE: ["interface"],
      IMPORT: ["import"],
      FUNCTION: ["function"],
      ARRAY: ["Array", "ArrayList"],
      MAP: ["Map"],
      INHERIT: ["inherits"],

      SEMI_COLON: [";"],
      LEFT_BRACE: ["{"],
      RIGHT_BRACE: ["}"],
      COMMA: [","],
      BACKSLASH: ["/"],
      "/$_CLASS": ["/$"],
      "$/_CLASS": ["$/"],
      LEFT_PARENTHESIS: ["("],
      RIGHT_PARENTHESIS: [")"],
      COLON: [":"],
      LEFT_BRACKER: ["["],
      RIGHT_BRACKER: ["]"],
      // DOUBLE_QUOTES: ['"'],
      // SINGLE_QUOTES: ["'"],
      DOUBLE_BLACKSLASH: ["\\"],
      DOT: ["."],
      "*_CLASS": ["*", "/", "%"],
      "+_CLASS": ["+", "-"],
      OP_CLASS: ["<", ">", "<=", ">=", "!=", "=="],
      AND_CLASS: ["&&"],
      OR_CLASS: ["||"],
      NOT_CLASS: ["!"],
      INC_DEC: ["++", "--"],
      "=_CLASS": ["="],
      ASSIGN_OP: ["+=", "-=", "*=", "/=", "%="],
      CATCH: ["catch"],
      THROW: ["throw"],
      THROWS: ["throws"],
      FINALLY: ["finally"],
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

    if (isCharValid) {
      return "CHAR"
    }

    if (/^"([^\\"]|\\.)+"$/.test(word)) {
      return "STRING"
    }

    // Check if the token is an identifier based on the rules
    if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(word)) {
      return "IDENTIFIER"
    }

    return "INVALID"
  }

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
  // splitTokensConsideringQuotes(line , lineNo) {
  //   const tokens = []
  //   let currentToken = ""
  //   let insideQuotes = false
  //   let quoteType = ""

  //   const reservedWords = [
  //     "Main",
  //     "final",
  //     "print",
  //     "If",
  //     "else",
  //     "static",
  //     "void",
  //     "int",
  //     "char",
  //     "string",
  //     "double",
  //     "boolean",
  //     "new",
  //     "function",
  //     "switch",
  //     "case",
  //     "default",
  //     "break",
  //     "continue",
  //     "for",
  //     "while",
  //     "Array",
  //     "ArrayList",
  //     "Map",
  //     "public",
  //     "private",

  //     "abstract",
  //     "interface",
  //     "import",
  //     "inherits",
  //     "implements",
  //   ]
  //   const operators = [
  //     "+=",
  //     "-=",
  //     "*=",
  //     "/=",
  //     "%=",
  //     "<=",
  //     ">=",
  //     "!=",
  //     "==",
  //     "&&",
  //     "||",
  //     "++",
  //     "--",
  //     "!",
  //     "=",
  //     "<",
  //     ">",
  //     "+",
  //     "-",
  //     "*",
  //     "/",
  //     "%",
  //   ]

  //   const isOperator = token => {
  //     return operators.includes(token)
  //   }

  //   const processToken = token => {
  //     let classPart

  //     // for (const classPart in this.classification) {
  //     //   if (this.classification[classPart].includes(word)) {
  //     //     return classPart
  //     //   }
  //     // }
  //     if (reservedWords.includes(token)) {
  //       classPart = token
  //     } else if (isOperator(token)) {
  //       classPart = "OPERATOR"
  //     } else {
  //       classPart = "IDENTIFIER"
  //     }

  //     tokens.push({
  //       value: token,
  //       class: classPart,
  //       line: lineNo + 1,
  //     })
  //   }

  //   for (let i = 0; i < line.length; i++) {
  //     const char = line[i]

  //     if (char === '"' || char === "'") {
  //       if (insideQuotes && quoteType === char) {
  //         currentToken += char // include the closing quote
  //         processToken(currentToken)
  //         currentToken = ""
  //         insideQuotes = false
  //       } else if (!insideQuotes) {
  //         quoteType = char
  //         insideQuotes = true
  //       }
  //     } else if (!insideQuotes) {
  //       if (/\s/.test(char) || operators.includes(char)) {
  //         if (currentToken !== "") {
  //           processToken(currentToken)
  //           currentToken = ""
  //         }
  //         if (operators.includes(char)) {
  //           processToken(char)
  //         }
  //       } else {
  //         currentToken += char
  //       }
  //     } else {
  //       currentToken += char
  //     }
  //   }

  //   if (!insideQuotes && currentToken !== "") {
  //     processToken(currentToken)
  //   }

  //   console.log("FUNCTIONS tokens ", tokens)
  //   return tokens
  // }

  splitTokensConsideringQuotes(line) {
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
        currentToken += char
      } else {
        currentToken += char
      }

      if (!insideQuotes) {
        // Check if the current token is a known keyword or operator
        const isKeywordOrOperator = this.isKeywordOrOperator(currentToken)
        if (isKeywordOrOperator) {
          tokens.push(currentToken)
          currentToken = ""
        }
      }
    }

    if (!insideQuotes) {
      tokens.push(currentToken)
    }

    if (currentToken !== "") {
      if (quoteType && currentToken.length === 1) {
        tokens.push(quoteType + currentToken)
      } else {
        tokens.push(currentToken)
      }
    }

    return tokens
  }

  isKeywordOrOperator(token) {
    // Check if the token is a known keyword or operator
    return (
      // (this.classification[classPart].includes(word))
      this.classification["DT"].includes(token) ||
      this.classification["BINARY_OP"].includes(token) ||
      this.classification["UNIARY_OP"].includes(token)
      // || this.reservedWords.includes(token)
    )
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
        "lineWithoutSingleLineComments = ",
        lineWithoutSingleLineComments,
        "\n"
      )
      const tokensInLine = this.splitTokensConsideringQuotes(
        lineWithoutSingleLineComments,
        lineNumber
      )

      console.log("line = ", line, "\n")
      console.log("tokensInLine = ", tokensInLine, "\n")

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
            classPart = "INTEGER"
          } else {
            classPart = "DOUBLE"
          }
        } else if (["true", "false"].includes(cleanedToken.toLowerCase())) {
          classPart = "BOOLEAN"
        } else if (
          classPart === "STRING" &&
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

        // if (classPart === "CHAR" || classPart === "STRING") {
        //   this.tokens.push({
        //     value: cleanedToken.substring(1, cleanedToken.length - 1), // Remove quotes for char and string tokens
        //     class: classPart,
        //     line: lineNumber + 1,
        //   })
        //   continue
        // }
      }
    }

    console.log("Tokens : ", this.tokens)
  }

  // Token : ( value part , class part , lineNo)
  writeTokensToFile() {
    const outputContent = this.tokens
      .map(token => `( ${token.value} , ${token.class}, LineNo: ${token.line})`)
      .join("\n")
    fs.writeFileSync(this.outputFilePath, outputContent)
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