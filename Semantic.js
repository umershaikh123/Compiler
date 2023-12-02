class SemanticAnalyzer {
  constructor() {
    this.mainTable = []
    this.currentScopeTable = null
    this.scopeCounter = 0
  }

  createScopeTable() {
    this.currentScopeTable = []
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
    // Implement your type checking logic here
    // Return true if types match, false otherwise
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

console.log("End of Semantic Analysis.")
