class SemanticAnalyzer {
  constructor() {
    this.mainTable = []
    this.currentScopeTable = []
    this.scopeCounter = 0
  }

  typeCheckInfo = {
    // parsing resultType = typecheckInfo.binary. [leftOP][operator][rightOP]

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
      console.error(`Re-declare error: ${name} already declared.`)
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
      console.error(`undeclare Error Class ${className} not found.`)
      return false
    }

    const memberTable = classEntry.MemberTable
    const exists = this.lookupInMemberTable(className, name)
    if (exists) {
      console.error(
        `Re-declare error: ${name} already declared in class ${className}.`
      )
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
      console.error(`undeclare Error Class ${className} not found.`)
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
      console.error(`Re-declare Error: ${name} already declared in this scope.`)
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
      console.error(
        `Error : Type mismatch: ${leftOperandType} ${operator} ${rightOperandType}`
      )
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
      console.error(`Error : Type mismatch: ${operator}${operandType}`)
      return null // or throw an error, depending on your error handling strategy
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
semanticAnalyzer.createScopeTable()
semanticAnalyzer.insertDataIntoScopeTable("localVar", "int")
semanticAnalyzer.createScopeTable()
semanticAnalyzer.insertDataIntoScopeTable("innerVar", "int")
semanticAnalyzer.createScopeTable()
semanticAnalyzer.insertDataIntoScopeTable("floatVar", "float")

// Analyze MainClass
semanticAnalyzer.insertDataIntoMainTable(
  "MainClass",
  "Class",
  "public",
  null,
  null
)
semanticAnalyzer.createScopeTable()
semanticAnalyzer.insertDataIntoScopeTable("mainVar", "int")
semanticAnalyzer.createScopeTable()
semanticAnalyzer.insertDataIntoScopeTable("innerMainVar", "int")

// Log the results
console.log("Main Table:")

for (const entry of semanticAnalyzer.mainTable) {
  console.log({
    Name: entry.Name,
    Type: entry.Type,
    AccessModifier: entry.AccessModifier,
    TypeModifier: entry.TypeModifier,
    Parent: entry.Parent,
    MemberTable: entry.MemberTable.map(member => ({
      Name: member.Name,
      Type: member.Type,
      AccessModifier: member.AccessModifier,
      TypeModifier: member.TypeModifier,
    })),
  })
}
console.log("Scope Table:")
for (const entry of semanticAnalyzer.currentScopeTable) {
  console.log({
    Name: entry.Name,
    Type: entry.Type,
    Scope: entry.Scope,
  })
}

// Example 1: Binary operation - Addition
const resultTypeAddition = semanticAnalyzer.typeCheck("int", "+", "int")
console.log("Result type for int + int:", resultTypeAddition) // Output: int

const resultTypeAddition2 = semanticAnalyzer.typeCheck("int", "+", "float")
console.log("Result type for int + float:", resultTypeAddition2) // Output: int

// Example 2: Binary operation - Subtraction
const resultTypeSubtraction = semanticAnalyzer.typeCheck("float", "-", "int")
console.log("Result type for float - int:", resultTypeSubtraction) // Output: float

// Example 3: Binary operation - Division (Type mismatch)
const resultTypeDivision = semanticAnalyzer.typeCheck("int", "/", "string")
console.log("Result type for int / string:", resultTypeDivision) // Output: Type mismatch: int / string

// Example 4: Unary operation - Increment
const resultTypeIncrement = semanticAnalyzer.typeCheckUnary("int", "++")
console.log("Result type for ++int:", resultTypeIncrement) // Output: int

// Example 5: Unary operation - Increment (Type mismatch)
const resultTypeInvalidIncrement = semanticAnalyzer.typeCheckUnary(
  "string",
  "++"
)
console.log("Result type for ++string:", resultTypeInvalidIncrement) // Output: Type mismatch: ++string
console.log("End of Semantic Analysis.")
