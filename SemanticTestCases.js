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
semanticAnalyzer.insertDataIntoScopeTable("localVar", "int")

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
// semanticAnalyzer.DestroyScope()
// semanticAnalyzer.CalllookupInScopeTable("a")

const r = semanticAnalyzer.CalllookupInMemberTable("MyClass", "myFunction")

console.log("  r ", r)
console.log(" scope stack", semanticAnalyzer.ScopeStack)

console.log("End of Semantic Analysis.")

// const functionTypes = extractFunctionTypes(r)
// console.log(functionTypes)
