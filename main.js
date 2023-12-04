const fs = require("fs")

class Lexer {
  constructor(inputFilePath, outputFilePath) {
    this.inputFilePath = inputFilePath
    this.outputFilePath = outputFilePath
    this.classification = {
      DT: ["void", "int", "bool", "float", "char", "string"],

      WDT: ["Integer", "Boolean", "Character", "String", "Float", "object"],
      implements: ["implements"],
      "=": ["="],
      RO: ["<", ">", "<=", ">=", "!=", "=="],
      MDM: ["*", "/", "%"],
      PM: ["+", "-"],
      AO: ["+=", "-=", "*=", "/=", "%="],
      inc_dec_Op: ["++", "--"],

      "!": ["!"],
      "||": ["||"],
      "&&": ["&&"],

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
      "float",
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

class SemanticAnalyzer {
  constructor() {
    this.mainTable = []
    this.currentScopeTable = []
    this.scopeCounter = 0
    this.error = []
  }

  typeCheckInfo = {
    // parsing resultType = typecheckInfo.binary. [leftOP][operator][rightOP]

    //.binary
    binary: {
      // .[leftop]
      int: {
        //. [leftop][operator]
        "+":
          // . [leftop][operator][rightop] rightOP is the key and resultType is the value
          { int: "int", float: "float" },
        "-": { int: "int", float: "float" },
        "*": { int: "int", float: "float" },
        "/": { int: "float", float: "float" },
        "%": { int: "int" },
        "<": { int: "boolean", float: "boolean" },
        ">": { int: "boolean", float: "boolean" },
        "<=": { int: "boolean", float: "boolean" },
        ">=": { int: "boolean", float: "boolean" },
        "!=": {
          int: "boolean",
          float: "boolean",
          string: "boolean",
          boolean: "boolean",
        },
        "==": {
          int: "boolean",
          float: "boolean",
          string: "boolean",
          boolean: "boolean",
        },
      },
      float: {
        "+": { int: "float", float: "float" },
        "-": { int: "float", float: "float" },
        "*": { int: "float", float: "float" },
        "/": { int: "float", float: "float" },
        "%": { int: "float", float: "float" },
        "<": { int: "boolean", float: "boolean" },
        ">": { int: "boolean", float: "boolean" },
        "<=": { int: "boolean", float: "boolean" },
        ">=": { int: "boolean", float: "boolean" },
        "!=": {
          int: "boolean",
          float: "boolean",
          string: "boolean",
          boolean: "boolean",
        },
        "==": {
          int: "boolean",
          float: "boolean",
          string: "boolean",
          boolean: "boolean",
        },
      },

      string: {
        "+": { string: "string" },
        "<": { string: "boolean" },
        ">": { string: "boolean" },
        "<=": { string: "boolean" },
        ">=": { string: "boolean" },
        "!=": { string: "boolean" },
        "==": { string: "boolean" },
      },
      boolean: {
        "&&": { boolean: "boolean" },
        "||": { boolean: "boolean" },
        "==": { boolean: "boolean" },
        "!=": { boolean: "boolean" },
      },
    },

    unary: {
      int: {
        "++": "int",
        "--": "int",
      },
      float: {
        "++": "float",
        "--": "float",
      },
      string: {
        "++": "string",
      },
      boolean: {
        "!": "boolean",
      },
    },

    assignment: {
      int: {
        "+=": "int",
        "-=": "int",
        "*=": "int",
        "/=": "float",
        "%=": "int",
      },
      float: {
        "+=": "float",
        "-=": "float",
        "*=": "float",
        "/=": "float",
        "%=": "float",
      },
      string: { "+=": "string" },
      boolean: {},
      object: { "=": "object" },
      array: { "=": "array" },
    },
    array: {
      int: "int_array",
      float: "float_array",
      string: "string_array",
      boolean: "boolean_array",
      object: "object_array",
    },
  }

  createScopeTable() {
    this.scopeCounter++
  }

  insertDataIntoMainTable(name, type, accessModifier, typeModifier, parent) {
    const exists = this.lookupInMainTable(name)
    if (exists) {
      const ErrorMessage = `Re-declare error: ${name} already declared.`
      console.error(ErrorMessage)
      this.error.push(ErrorMessage)
      return false
    }

    this.mainTable.push({
      Name: name,
      Type: type,
      AccessModifier: accessModifier,
      TypeModifier: typeModifier,
      Parent: parent,
      MemberTable: [],
    })

    return true
  }

  insertDataIntoMemberTable(
    className,
    name,
    type,
    accessModifier,
    typeModifier
  ) {
    const classEntry = this.lookupInMainTable(className)
    if (!classEntry) {
      const ErrorMessage = `undeclare Error Class ${className} not found.`

      console.error(ErrorMessage)
      this.error.push(ErrorMessage)
      return false
    }

    const memberTable = classEntry.MemberTable
    const exists = this.lookupInMemberTable(className, name)
    if (exists) {
      const ErrorMessage = `Re-declare error: ${name} already declared in class ${className}.`

      console.error(ErrorMessage)
      this.error.push(ErrorMessage)

      return false
    }

    memberTable.push({
      Name: name,
      Type: type,
      AccessModifier: accessModifier,
      TypeModifier: typeModifier,
    })

    return true
  }

  lookupInMainTable(name) {
    return this.mainTable.find(entry => entry.Name === name)
  }

  lookupInMemberTable(className, name) {
    const classEntry = this.lookupInMainTable(className)
    if (!classEntry) {
      const ErrorMessage = `undeclare Error Class ${className} not found.`

      console.error(ErrorMessage)
      this.error.push(ErrorMessage)

      return false
    }

    const memberTable = classEntry.MemberTable
    return memberTable.find(entry => entry.Name === name)
  }

  lookupInScopeTable(name) {
    return this.currentScopeTable.find(entry => entry.Name === name)
  }

  insertDataIntoScopeTable(name, type) {
    const exists = this.lookupInScopeTable(name)
    if (exists) {
      const ErrorMessage = `Re-declare Error: ${name} already declared in this scope.`

      console.error(ErrorMessage)
      this.error.push(ErrorMessage)

      return false
    }

    this.currentScopeTable.push({
      Name: name,
      Type: type,
      Scope: this.scopeCounter,
    })

    return true
  }

  typeCheck(leftOperandType, operator, rightOperandType) {
    // Check if the operator and operand types are defined in the typeCheckInfo
    if (
      this.typeCheckInfo.binary &&
      this.typeCheckInfo.binary[leftOperandType] &&
      this.typeCheckInfo.binary[leftOperandType][operator] &&
      this.typeCheckInfo.binary[leftOperandType][operator][rightOperandType]
    ) {
      return this.typeCheckInfo.binary[leftOperandType][operator][
        rightOperandType
      ]
    } else {
      const ErrorMessage = `Error : Type mismatch: ${leftOperandType} ${operator} ${rightOperandType}`

      console.error(ErrorMessage)
      this.error.push(ErrorMessage)

      return null // or throw an error, depending on your error handling strategy
    }
  }

  typeCheckUnary(operandType, operator) {
    // Check if the operator and operand type are defined in the typeCheckInfo
    if (
      this.typeCheckInfo.unary &&
      this.typeCheckInfo.unary[operandType] &&
      this.typeCheckInfo.unary[operandType][operator]
    ) {
      return this.typeCheckInfo.unary[operandType][operator]
    } else {
      const ErrorMessage = `Error : Type mismatch: ${operator}${operandType}`

      console.error(ErrorMessage)
      this.error.push(ErrorMessage)

      return null // or throw an error, depending on your error handling strategy
    }
  }
}

const semanticAnalyzer = new SemanticAnalyzer()
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
      //  insert into MainTable
      "{",
      //scope
      "<ClassBody>",
      // insert into member table
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
    let parameterValues = {}
    for (const rule of productionRule) {
      console.log(`Checking production rule: ${rule}`)
      let ruleIndex = 0
      let failed = false

      for (const symbol of rule) {
        if (typeof symbol === "string" && symbol.startsWith("<")) {
          // It's a non-terminal
          console.log(`Processing non-terminal: ${symbol}  \n`)
          const valuePart = parseNonTerminalValue(symbol)
          console.log("valuePart", valuePart)
          if (valuePart !== null) {
            // Store value part for the non-terminal
            // parameterValues[symbol] = valuePart
            if (parameterValues[symbol]) {
              parameterValues[symbol].push(valuePart)
            } else {
              parameterValues[symbol] = [valuePart]
            }
            // parameterValues[symbol] = parameterValues[symbol] || []
            // parameterValues[symbol].push(valuePart)
          }
          if (!parseNonTerminal(symbol)) {
            failed = true
            // const valuePart = parseNonTerminalValue(symbol)
            // console.log("valuePart", valuePart)
            // if (valuePart !== null) {
            //   // Store value part for the non-terminal
            //   parameterValues[symbol] = valuePart
            // }
            break
          }

          // Example: Call a semantic function based on non-terminal
        } else if (symbol !== "null") {
          // It's a terminal
          const currentToken = tokens[tokenIndex]
          console.log("currentToken", currentToken)
          if (currentToken && currentToken.classpart === symbol) {
            //   console.log("currentToken.classpart", currentToken.classpart)
            const terminalValue = currentToken.valuepart
            // parameterValues[symbol] = terminalValue
            // parameterValues[symbol] = parameterValues[symbol] || []
            // parameterValues[symbol].push(terminalValue)

            if (parameterValues[symbol]) {
              parameterValues[symbol].push(terminalValue)
            } else {
              parameterValues[symbol] = [terminalValue]
            }
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
        // callSemanticFunction(symbol, parameterValues)
        console.log("parameterValues", parameterValues)
        ruleIndex++
      }
      if (!failed) {
        return true // Successfully parsed the production rule
      }
    }
  }

  return false // All production rules failed
}

function parseNonTerminalValue(nonTerminal) {
  // Example: Parse the value part for a non-terminal
  const currentToken = tokens[tokenIndex]
  console.log("nonTerminal", nonTerminal)

  if (currentToken) {
    // Adjust this based on your token structure

    return currentToken.valuepart
  }
  return null
}

// Name: name,
// Type: type,
// AccessModifier: accessModifier,
// TypeModifier: typeModifier,
// Parent: parent,
// Inherit : interface or class
// Interfaces : ?
function callSemanticFunction(nonTerminal, parameterValues) {
  // Example: Call semantic function based on non-terminal and parameter values
  if (nonTerminal === "<ClassDecl>") {
    nonTerminal = "<ClassAccMod>"
    if (nonTerminal === "<ClassAccMod>") {
      const accessModifier = parameterValues[nonTerminal]

      nonTerminal = "<ClassNonAccMod>"
      if (nonTerminal === "<ClassNonAccMod>") {
        const typeModifier = parameterValues[nonTerminal]
        const type = "class"
        const Name = parameterValues["ID"] // get token value part of ID

        nonTerminal = "<Extra>"
        if (nonTerminal === "<Extra>") {
          const parent = ID
          const Inherit = ID
          const Interfaces = ID

          semanticAnalyzer.insertDataIntoMainTable(
            Name,
            type,
            accessModifier,
            typeModifier,
            parent,
            Inherit,
            Interfaces
          )
          return true
        }
      }
    }
  }

  return false
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
