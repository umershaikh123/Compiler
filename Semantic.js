class SemanticAnalyzer {
  constructor() {
    this.mainTable = [] // Main Table for classes, interfaces, abstract classes
    this.currentScopeTable = null // Current Scope Table
    this.scopeCounter = 0 // Counter for generating unique scope IDs
  }

  createScopeTable() {
    this.currentScopeTable = []
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
      console.error(`Class ${className} not found.`)
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
      console.error(`Class ${className} not found.`)
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
      console.error(`Re-declare error: ${name} already declared in this scope.`)
      return false
    }

    this.currentScopeTable.push({
      Name: name,
      Type: type,
      Scope: this.scopeCounter,
    })

    return true
  }

  typeCheck(leftOperandType, rightOperandType, operator) {
    // Return true if types match, false otherwise
    // Hard code type check information
  }
}

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

// Enter the method scope and insert data into the scope table
semanticAnalyzer.createScopeTable() // Create a new scope for the method
semanticAnalyzer.insertDataIntoScopeTable("localVar", "int")

// Enter an inner block scope and insert data into the scope table
semanticAnalyzer.createScopeTable() // Create a new scope for the inner block
semanticAnalyzer.insertDataIntoScopeTable("innerVar", "int")

// // Example Usage:
// semanticAnalyzer.createScopeTable()
// semanticAnalyzer.insertDataIntoMainTable(
//   "MyClass",
//   "Class",
//   "public",
//   null,
//   null
// )
// semanticAnalyzer.insertDataIntoMemberTable(
//   "MyClass",
//   "myAttribute",
//   "int",
//   "private",
//   null
// )
// semanticAnalyzer.insertDataIntoScopeTable("variable1", "int")

console.log("Main Table:", semanticAnalyzer.mainTable)
console.log("End of Semantic Analysis.")
