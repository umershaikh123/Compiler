class SemanticAnalyzer {
  constructor() {
    this.mainTable = []
    this.currentScopeTable = []
    this.ScopeStack = []
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
          { int: "int", float: "float", string: "string" },
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
        "+": { string: "string", int: "string" },

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
        "+=": { int: "int" },
        "-=": { int: "int" },
        "*=": { int: "int" },
        "/=": { float: "float" },
        "%=": { int: "int" },
      },
      float: {
        "+=": { float: "float" },
        "-=": { float: "float" },
        "*=": { float: "float" },
        "/=": { float: "float" },
        "%=": { float: "float" },
      },
      string: { "+=": { string: "string" } },
    },

    array: {
      Integer: "int_array",
      Float: "float_array",
      Character: "char_array",
      String: "string_array",
      Boolean: "boolean_array",
      object: "object_array",
    },

    object: { ID: "object" },
  }

  createScope() {
    this.scopeCounter++
    this.ScopeStack.push(this.scopeCounter)
  }
  DestroyScope() {
    this.ScopeStack.pop(this.scopeCounter)
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
      Parent: parent || [],
      MemberTable: [],
    })

    return true
  }

  insertDataIntoMemberTable(
    className,
    name,
    types,
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

    const formattedType = Array.isArray(types)
      ? types.slice(0, -1).join(", ") + " -> " + types.slice(-1)
      : types

    memberTable.push({
      Name: name,
      Type: formattedType,
      AccessModifier: accessModifier,
      TypeModifier: typeModifier,
    })

    return true
  }

  insertDataIntoScopeTable(name, type) {
    const exists = this.lookupInScopeTable(name)
    console.log("exists", exists)
    if (exists) {
      const ErrorMessage = `Re-declare Error: ${name} already declared in scope ${this.scopeCounter}.`

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

  lookupInMainTable(name) {
    return this.mainTable.find(entry => entry.Name === name)
  }

  lookupInMemberTable(className, name) {
    const classEntry = this.lookupInMainTable(className)
    if (!classEntry) {
      const ErrorMessage = `undeclared Error Class ${className} not found in Main Table.`

      console.error(ErrorMessage)
      this.error.push(ErrorMessage)

      return false
    }

    const memberTable = classEntry.MemberTable
    return memberTable.find(entry => entry.Name === name)
  }

  lookupInScopeTable(name) {
    let currentScopeIndex = this.ScopeStack.indexOf(
      this.ScopeStack[this.ScopeStack.length - 1]
    )
    console.log("Last value", currentScopeIndex)
    if (
      this.currentScopeTable.some(
        entry => entry.Name === name && entry.Scope === this.scopeCounter
      ) === false
    ) {
      const currentScope = this.ScopeStack[currentScopeIndex]
      return this.currentScopeTable.some(
        entry => entry.Name === name && entry.Scope === currentScope
      )
    } else {
      while (currentScopeIndex >= 0) {
        const currentScope = this.ScopeStack[currentScopeIndex]
        // console.log("parent scope lookup", currentScope)
        const isInCurrentScope = this.currentScopeTable.some(
          entry => entry.Name === name && entry.Scope === currentScope
        )

        if (isInCurrentScope) {
          console.log("scope  Found")

          console.log(
            "value Found",
            this.currentScopeTable.some(
              entry => entry.Name === name && entry.Scope === currentScope
            )
          )
          return this.currentScopeTable.some(
            entry => entry.Name === name && entry.Scope === currentScope
          )
        }

        currentScopeIndex--
      }
    }

    return null
  }

  CalllookupInMainTable(name) {
    const result = this.lookupInMainTable(name)
    if (result) {
      return result
    } else {
      const ErrorMessage = `Undeclare Error: ${name} does not exists in MainTable`

      console.error(ErrorMessage)
      this.error.push(ErrorMessage)
    }
  }

  CalllookupInMemberTable(className, name) {
    const result = this.lookupInMemberTable(className, name)
    if (result) {
      return result
    } else {
      const ErrorMessage = `Undeclared Error:  ${name} with ${className}   does not exists in Member Table`

      console.error(ErrorMessage)
      this.error.push(ErrorMessage)
    }
  }

  CalllookupInScopeTable(name) {
    const result = this.lookupInScopeTable(name)
    if (result) {
      return result
    } else {
      const ErrorMessage = `Undeclared Error: ${name} does not exists in ScopeTable with current scope ${
        this.ScopeStack[this.ScopeStack.length - 1]
      } or parent scope`

      console.error(ErrorMessage)
      this.error.push(ErrorMessage)
    }
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

      return null
    }
  }

  typeCheckUnary(operandType, operator) {
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

      return null
    }
  }

  typeCheckAssignment(leftOperandType, operator, rightOperandType) {
    if (
      this.typeCheckInfo.assignment &&
      this.typeCheckInfo.assignment[leftOperandType] &&
      this.typeCheckInfo.assignment[leftOperandType][operator] &&
      this.typeCheckInfo.assignment[leftOperandType][operator][rightOperandType]
    ) {
      return this.typeCheckInfo.assignment[leftOperandType][operator][
        rightOperandType
      ]
    } else {
      const ErrorMessage = `Error : Type mismatch: ${leftOperandType} ${operator} ${rightOperandType}`

      console.error(ErrorMessage)
      this.error.push(ErrorMessage)

      return null
    }
  }

  typeCheckArray(operator) {
    if (this.typeCheckInfo.array && this.typeCheckInfo.array[operator]) {
      return this.typeCheckInfo.array[operator]
    } else {
      const ErrorMessage = `Error : Type mismatch: ${operator} `

      console.error(ErrorMessage)
      this.error.push(ErrorMessage)

      return null
    }
  }

  typeCheckObject(operator) {
    if (this.typeCheckInfo.object && this.typeCheckInfo.object[operator]) {
      return this.typeCheckInfo.object[operator]
    } else {
      const ErrorMessage = `Error : Type mismatch: ${operator} `

      console.error(ErrorMessage)
      this.error.push(ErrorMessage)

      return null
    }
  }
}

function extractFunctionTypes(row) {
  const typeString = row.Type

  // If the typeString contains '->', it's a function type
  if (typeString.includes("->")) {
    const [parameterTypes, returnType] = typeString.split(" -> ")

    // Split the parameter types by comma
    const parameters = parameterTypes.split(",").map(type => type.trim())

    return {
      parameters,
      returnType,
    }
  }

  // If there's no '->', it's not a function type
  return {
    parameters: [],
    returnType: typeString.trim(),
  }
}

const semanticAnalyzer = new SemanticAnalyzer()

semanticAnalyzer.createScope()

semanticAnalyzer.insertDataIntoMainTable("MyClass", "Class", "public", null, [
  "parent1",
  "parent2",
])

semanticAnalyzer.insertDataIntoMainTable(
  "MyClass2",
  "Class",
  "public",
  null,
  "parent1"
)

semanticAnalyzer.insertDataIntoMemberTable(
  "MyClass",
  "myFunction",
  ["int", "double", "double", "double"],
  "public",
  null
)

semanticAnalyzer.insertDataIntoMemberTable(
  "MyClass",
  "myAttribute",
  "int",
  "private",
  null
)

semanticAnalyzer.insertDataIntoMemberTable(
  "MyClass",
  "myAttribute3",
  "int",
  "private",
  null
)

semanticAnalyzer.insertDataIntoMemberTable(
  "MyClass",
  "myMethod",
  "int",
  "private",
  null
)

semanticAnalyzer.insertDataIntoMainTable(
  "MainClass",
  "Class",
  "public",
  null,
  null
)
semanticAnalyzer.insertDataIntoMemberTable(
  "MainClass",
  "myAttribute",
  "int",
  "private",
  null
)

semanticAnalyzer.insertDataIntoMemberTable(
  "MainClass",
  "myMethod",
  "int",
  "private",
  null
)
semanticAnalyzer.createScope()
semanticAnalyzer.insertDataIntoScopeTable("localVar", "int")

semanticAnalyzer.createScope()

semanticAnalyzer.insertDataIntoScopeTable("innerVar", "int")
semanticAnalyzer.createScope()
semanticAnalyzer.insertDataIntoScopeTable("floatVar", "float")

semanticAnalyzer.createScope()
semanticAnalyzer.insertDataIntoScopeTable("a", "int")
semanticAnalyzer.createScope()
semanticAnalyzer.insertDataIntoScopeTable("b", "int")
semanticAnalyzer.createScope()
semanticAnalyzer.insertDataIntoScopeTable("c", "float")

semanticAnalyzer.createScope()
semanticAnalyzer.insertDataIntoScopeTable("mainVar", "int")
semanticAnalyzer.createScope()
semanticAnalyzer.DestroyScope()

semanticAnalyzer.insertDataIntoScopeTable("innerMainVar", "int")
semanticAnalyzer.DestroyScope()
semanticAnalyzer.DestroyScope()
semanticAnalyzer.DestroyScope()

// Define an interface
semanticAnalyzer.insertDataIntoMainTable(
  "Shape",
  "interface",
  "public",
  null,
  null
)

semanticAnalyzer.insertDataIntoMemberTable(
  "Shape",
  "calculateArea",
  ["void , double"],
  "public",
  "abstract"
)
semanticAnalyzer.insertDataIntoMemberTable(
  "Shape",
  "getColor",
  ["void", "string"],
  "public",
  "abstract"
)

semanticAnalyzer.insertDataIntoMainTable("Circle", "class", "public", null, [
  "Shape",
])
semanticAnalyzer.insertDataIntoMemberTable(
  "Circle",
  "calculateArea",
  ["void", "double"],
  "public",
  null
)
semanticAnalyzer.insertDataIntoMemberTable(
  "Circle",
  "getColor",
  ["void", "string"],
  "public",
  null
)

semanticAnalyzer.insertDataIntoMainTable(
  "Vehicle",
  "abstract class",
  "public",
  null,
  null
)

semanticAnalyzer.insertDataIntoMemberTable(
  "Vehicle",
  "startEngine",
  ["void", "void"],
  "public",
  "abstract"
)
semanticAnalyzer.insertDataIntoMemberTable(
  "Vehicle",
  "stopEngine",
  ["void", "void"],
  "public",
  null
)

semanticAnalyzer.insertDataIntoMainTable("Car", "class", "public", null, [
  "Vehicle",
])
semanticAnalyzer.insertDataIntoMemberTable(
  "Car",
  "startEngine",
  ["void", "void"],
  "public",
  null
)
const r = semanticAnalyzer.CalllookupInMemberTable("MyClass", "myAttribute")

console.log("  r ", r)
console.log(" scope stack", semanticAnalyzer.ScopeStack)

console.log("End of Semantic Analysis.")

const functionTypes = extractFunctionTypes(r)
console.log(functionTypes)
