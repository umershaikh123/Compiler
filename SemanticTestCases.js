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
