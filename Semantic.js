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

  insertDataIntoScopeTable(name, type) {
    const exists = this.lookupInScopeTable(name, this.scopeCounter)
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

  lookupInScopeTable(name, scope) {
    return this.currentScopeTable.some(
      entry => entry.Name === name && entry.Scope === scope
    )
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

  CalllookupInlookupInMemberTable(className, name) {
    const result = this.lookupInMemberTable(className, name)
    if (result) {
      return result
    } else {
      const ErrorMessage = `Undeclared Error:  ${name} with ${className}   does not exists in Member Table`

      console.error(ErrorMessage)
      this.error.push(ErrorMessage)
    }
  }

  CalllookupInScopeTable(name, scope) {
    const result = this.lookupInScopeTable(name, scope)
    if (result) {
      return result
    } else {
      const ErrorMessage = `Undeclared Error: ${name} with  ${scope} does not exists in ScopeTable`

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

      return null
    }
  }
}

// Assume we have the following Java-like code
const javaCode = `
class MyClass {
  private int myAttribute;

  public void myMethod() {
    int localVar = 42;
    {
      int innerVar = 10;
    }
  }

  public void anotherMethod() {
    float floatVar = 3.14;
  }
}

public class MainClass {
  public static void main(String[] args) {
    int mainVar = 100;
    {
      int innerMainVar = 50;
    }

    MyClass myObject = new MyClass();
    myObject.myMethod();
    myObject.anotherMethod();
  }
}
`

const semanticAnalyzer = new SemanticAnalyzer()

// Start semantic analysis
semanticAnalyzer.createScopeTable()

semanticAnalyzer.insertDataIntoMainTable(
  "MyClass",
  "Class",
  "public",
  null,
  null
)

// const r = semanticAnalyzer.CalllookupInMainTable("MyClass")

// const r4 = semanticAnalyzer.CalllookupInMainTable("MyAbstractClass")

// console.log("lookup false", r4)

// console.log("lookup", r)

semanticAnalyzer.insertDataIntoMemberTable(
  "MyClass",
  "myAttribute",
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

// Analyze MainClass
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
semanticAnalyzer.createScopeTable()
semanticAnalyzer.insertDataIntoScopeTable("localVar", "int")
semanticAnalyzer.createScopeTable()
semanticAnalyzer.insertDataIntoScopeTable("localVar", "int")
semanticAnalyzer.insertDataIntoScopeTable("innerVar", "int")
semanticAnalyzer.createScopeTable()
semanticAnalyzer.insertDataIntoScopeTable("floatVar", "float")

semanticAnalyzer.createScopeTable()
semanticAnalyzer.insertDataIntoScopeTable("a", "int")
semanticAnalyzer.createScopeTable()
semanticAnalyzer.insertDataIntoScopeTable("b", "int")
semanticAnalyzer.createScopeTable()
semanticAnalyzer.insertDataIntoScopeTable("c", "float")

semanticAnalyzer.createScopeTable()
semanticAnalyzer.insertDataIntoScopeTable("mainVar", "int")
semanticAnalyzer.createScopeTable()
semanticAnalyzer.insertDataIntoScopeTable("innerMainVar", "int")

// semanticAnalyzer.lookupInMemberTable("Animal", "c")
const r1 = semanticAnalyzer.lookupInMainTable(
  "Animal",
  "Class",
  "public",
  null,
  null
)
const r2 = semanticAnalyzer.lookupInScopeTable("Animal", 3)

const resultTypeAddition = semanticAnalyzer.typeCheck("int", "+", "int")
console.log("Result type for int + int:", resultTypeAddition) // Output: int

const resultTypeAddition2 = semanticAnalyzer.typeCheck("int", "+", "float")
console.log("Result type for int + float:", resultTypeAddition2) // Output: int

const resultTypeSubtraction = semanticAnalyzer.typeCheck("float", "-", "int")
console.log("Result type for float - int:", resultTypeSubtraction) // Output: float

// const resultTypeDivision = semanticAnalyzer.typeCheck("int", "/", "string")
// console.log("Result type for int / string:", resultTypeDivision) // Output: Type mismatch: int / string

const resultTypeIncrement = semanticAnalyzer.typeCheckUnary("int", "++")
console.log("Result type for ++int:", resultTypeIncrement) // Output: int

const resultTypeInvalidIncrement = semanticAnalyzer.typeCheckUnary(
  "string",
  "++"
)
console.log("Result type for ++string:", resultTypeInvalidIncrement) // Output: Type mismatch: ++string
console.log("End of Semantic Analysis.")
