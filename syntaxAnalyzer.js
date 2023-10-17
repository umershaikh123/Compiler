const selectionSets = {
  ClassDecl: ["public", "private", "default"],
  Extra: ["{"],
  InterfaceIDList: ["ID"],
  listID: ["{"],
  ClassBody: ["{"],
  ClassBodyDecl: ["   "],
  C: ["{", "void", "int", "bool", "float", "char", "string"],
  L: [],
  Parameters: [],
  parameter_list: [],
  Parameter: ["DT"],
  return_type: ["void", "int", "float", "char", "bool", "string"],
  Main_Func: ["public", "private"],
  Attributes: ["DT", "ArrayList", "HashMap"],
  A: ["ID", "["],
  abstract_fun: ["public"],
  AM: ["public", "private"],
  AMO: ["Static"],
  ClassAccMod: ["public", "private", "default"],
  ClassNonAccMod: ["class"],
  Body: ["}", "break"],
  SST: ["public", "private", "while", "if", "do", "for", "switch", "try", "ID"],
  MST: ["}", "break"],
  S: ["."],
  S2: [
    "ID",
    "add",
    "get",
    "set",
    "remove",
    "clear",
    "size",
    "put",
    "length",
    "FieldID",
  ],
  AM_st: ["public", "private"],
  NS: ["Static", "DT", "ArrayList", "Hashmap", "ID"],
  ST: ["DT", "ArrayList", "Hashmap", "ID"],
  interface_Dec: ["interface"],
  interface_Body: ["}"],
  NT: ["Static", "DT", "ID"],
  Interface_Var_init: ["Static", "DT"],
  Init: ["DT"],
  Fun_Head: ["ID"],
  obj_Dec: ["ObjectType"],
  O1: [";"],
  Var: ["ID"],
  V: [",", ";", "="],
  Var_Dec: [",", ";"],
  V2: [
    "this",
    "ID",
    "int_const",
    "bool_const",
    "double_const",
    "str_const",
    "char_const",
    "!",
  ],

  Array: ["["],
  list: [",", "="],
  array_init: [";", "="],
  Al: ["{", "new"],
  list_values: ["}"],
  array_use: ["ID"],
  array_change_value: [";", "="],
  WDT: ["Integer", "String", "Boolean", "Character", "Float"],
  arraylist: ["ArrayList"],
  HashMap: ["HashMap"],
  While_St: ["while"],
  Do_while_St: ["do"],
  if_else: ["if"],
  O_if_Else: ["else", "$"],
  O_Else: ["$"],
  for_St: ["for"],
  F2: [";"],
  F3: ["ID", "++", "--"],
  F4: ["++", "--", "="],
  inc_dec_Op: ["++", "--"],

  assign_St: [""],
  assign_left: ["="],
  assign_right: [
    "this",
    "ID",
    "int_const",
    "bool_const",
    "double_const",
    "str_const",
    "char_const",
    "!",
  ],
  Z: ["ε"],
  func_St: ["("],
  Parameters: [")"],
  parameter_list: [")"],
  Parameter: ["DT"],
  return_type: ["void", "int", "float", "char", "bool", "string"],
  func_call: ["("],
  Arguments: [
    "this",
    "ID",
    "int_const",
    "bool_const",
    "double_const",
    "str_const",
    "char_const",
    "!",
  ],
  Switch_St: ["Switch"],
  case_blocks: ["}"],
  case_block: ["case"],
  default_block: ["default"],
  break_St: ["break"],
  continue_St: ["continue"],
  try_catch_block: ["try"],
  catch_block: ["catch"],
  finally_block: ["$"],
  except_type: ["ID", "Const"],
  IC: ["ID", "Const"],

  Dot_St: ["ID"],
  D1: ["ID", "add", "get", "set", "remove", "clear", "size", "put", "length"],
  Object_opertaions: ["ID"],
  Object_operations_tail: ["$"],
  array_operations: ["length"],
  Operations: ["add", "get", "set", "remove", "clear", "size", "put"],
  add_operation: ["add"],
  get_operation: ["get"],
  set_operation: ["set"],
  remove_operation: ["remove"],
  clear_operation: ["clear"],
  size_operation: ["size"],
  put_operation: ["put"],
  index: ["int_const"],
  OE: [
    "this",
    "ID",
    "int_const",
    "bool_const",
    "double_const",
    "str_const",
    "char_const",
    "!",
  ],
  "OE’": [")", "]", ";", "$"],
  AE: [
    "this",
    "ID",
    "int_const",
    "bool_const",
    "double_const",
    "str_const",
    "char_const",
    "!",
  ],
  "AE’": ["||", ")", "]", ";", "$"],
  R: [
    "this",
    "ID",
    "int_const",
    "bool_const",
    "double_const",
    "str_const",
    "char_const",
    "!",
  ],
  "R’": ["&&", "||", ")", "]", ";", "$"],
  E: [
    "this",
    "ID",
    "int_const",
    "bool_const",
    "double_const",
    "str_const",
    "char_const",
    "!",
  ],
  "E’": ["RO", "&&", "||", ")", "]", ";", "$"],
  T: [
    "this",
    "ID",
    "int_const",
    "bool_const",
    "double_const",
    "str_const",
    "char_const",
    "!",
  ],
  "T’": ["PM", "RO", "&&", "||", ")", "]", ";", "$"],
  F: [
    "this",
    "ID",
    "int_const",
    "bool_const",
    "double_const",
    "str_const",
    "char_const",
    "!",
  ],
  F1: ["MDM", "PM", "RO", "&&", "||", ")", "]", ";", "$"],
  F5: ["MDM", "PM", "RO", "&&", "||", ")", "]", ";", "$"],
  AL: [")"],
  Argument: [
    "this",
    "ID",
    "int_const",
    "bool_const",
    "double_const",
    "str_const",
    "char_const",
    "!",
  ],
  Next_Argument: [")"],
  P: ["ID"],
}

const grammar = {
  "<ClassDecl>": [
    [
      "<ClassAccMod>",
      "<ClassNonAccMod>",
      "class",
      "Id",
      "<Extra>",
      "{",
      "<ClassBody>",
      "}",
    ],
  ],
  "<Extra>": [
    ["Extends", "classID"],
    ["Implements", "<InterfaceIDList>"],
    ["ε"],
  ],
  "<InterfaceIDList>": [["ID", "<listID>"]],
  "<listID>": [[",", "ID", "<listID>"], ["ε"]],
  "<ClassBody>": [["<AM>", "<ClassBodyDecl>", "<ClassBody>"], ["ε"]],
  "<ClassBodyDecl>": [
    ["ID", "(", "<Parameters>", ")", ":", "<C>"],
    ["<L>"],
    ["<AM0>", "<L>"],
    ["e"],
  ],
  "<C>": [
    ["{", "<Body>", "}"],
    ["<return_type>", "{", "<Body>", "}"],
  ],
  "<L>": [["<Attributes>"], ["<Main_Func>"], ["<abstract_fun>"]],
  "<Parameters>": [["<Parameter>"], ["<parameter_list>"], ["ε"]],
  "<parameter_list>": [[",", "<Parameter>", "<parameter_list>"], ["ε"]],
  "<Parameter>": [["DT", "ID"]],
  "<return_type>": [
    ["void"],
    ["int"],
    ["bool"],
    ["float"],
    ["char"],
    ["string"],
  ],
  "<Main_Func>": [
    ["main", "()", ":", "void", "{", "<Body>", "}", "<Main_Func>"],
    ["e"],
  ],
  "<Attributes>": [["DT", "<A>"], ["<ArrayList>"], ["<HashMap>"]],
  "<A>": [["<Var>"], ["<Array>"]],
  "<abstract_fun>": [["abstract", "ID", "(", "<Arguments>", ")", ":", "DT"]],
  "<AM>": [["public", "I", "private"]],
  "<AM0>": [["Static"]],
  "<ClassAccMod>": [["public"], ["private"], ["default"]],
  "<ClassNonAccMod>": [["final"], ["abstract"], ["ε"]],
  "<Body>": [["<MST>"], ["ε"]],
  "<SST>": [
    ["<AM_st>"],
    ["<While_St>"],
    ["<if_else>"],
    ["<Do_while_St>"],
    ["<for_St>"],
    ["<Switch_St>"],
    ["<try_catch_block>"],
    ["ID", "<S>"],
  ],
  "<S>": [[".", "<S2>"]],
  "<S2>": [["<D1>"], ["<assign_st>"]],
  "<AM_st>": [["<AM>", "<NS>"]],
  "<NS>": [["<AM0>", "<ST>"], ["<ST>"]],
  "<ST>": [["<Attributes>"], ["ID", "<func_st>"]],
  "<MST>": [["<SST>", "<MST>"], ["ε"]],
  "<Var>": [["ID", "<V>"]],
  "<V>": [["<Var_Dec>"], ["=", "<V2>"]],
  "<Var_Dec>": [[",", "ID", "<Var_Dec>"], [";"]],
  "<V2>": [["<Var_Init>"], ["<assign_right>"]],
  "<Var_Init>": [["<Const>", "<var_init_list>"]],
  "<var_init_list>": [[",", "ID", "=", "<Const>", "<var_init_list>"], ["ε"]],
  //   "<Const>": [
  //     ["int_const"],
  //     ["double_const"],
  //     ["str_const"],
  //     ["char_const"],
  //     ["bool_const"],
  //   ],
  "<While_St>": [["while", "(", "<OE>", ")", "{", "<Body>", "}"]],
  "<Do_while_St>": [["do", "{", "<Body>", "}", "while", "(", "<OE>", ")", ";"]],
  "<if_else>": [
    ["if", "(", "<OE>", ")", "{", "<Body>", "}", "<O_if_Else>", "<O_Else>"],
  ],
  "<for_St>": [
    ["for", "(", "<Var>", ";", "<F2>", ";", "<F3>", ")", "{", "<Body>", "}"],
  ],
  "<F2>": [["<OE>"], ["ε"]],
  "<F3>": [
    ["ID", "<F4>"],
    ["<inc_dec_Op>", "ID", ";"],
  ],
  "<F4>": [
    ["<inc_dec_Op>", ";"],
    ["=", "<assign_right>"],
  ],
  "<inc_dec_Op>": [["++"], ["--"]],
  "<assign_st>": [["<assign_left>", "=", "<assign_right>"]],
  "<assign_left>": [[".", "FieldID"], ["ε"]],
  "<assign_right>": [["<OE>", "<Z>"]],
  "<Z>": [[".", "<D1>"], ["ε"]],
  "<func_St>": [
    ["(", "<Parameters>", ")", ":", "<return_type>", "{", "<Body>", "}"],
  ],
  //   "<Parameters>": [["<Parameter>"], ["<parameter_list>"], ["ε"]],
  //   "<parameter_list>": [[",", "<Parameter>", "<parameter_list>"], ["ε"]],
  //   "<Parameter>": [["DT", "ID"]],
  //   "<return_type>": [
  //     ["void"],
  //     ["int"],
  //     ["bool"],
  //     ["float"],
  //     ["char"],
  //     ["string"],
  //   ],
  "<func_call>": [["(", "<Arguments>", ")"]],
  "<Arguments>": [["<OE>"]],
  "<Switch_St>": [["Switch", "(", "<OE>", ")", "{", "<case_blocks>", "}"]],
  "<case_blocks>": [
    ["<case_block>", "<case_blocks>"],
    ["<default_block>"],
    ["ε"],
  ],
  "<case_block>": [["case", "<Const>", ":", "<Body>", "break", ";"]],
  "<default_block>": [["default", ":", "<Body>", "break", ";"]],
  "<break_St>": [["break", ";"]],
  "<continue_St>": [["continue", ";"]],
  "<try_catch_block>": [
    ["try", "{", "<body>", "}", "<catch_block>", "<finally_block>"],
  ],
  "<catch_block>": [
    ["catch", "(", "<except_type>", "<except_Var>", ")", "{", "<body>", "}"],
  ],
  "<finally_block>": [["{", "<body>", "}"], ["ε"]],
  "<except_type>": [["<IC>"]],
  "<IC>": [["ID"], ["<Const>"]],
  "<Interface_Dec>": [["interface", "ID", "{", "<Interface_Body>", "}"]],
  "<Interface_Body>": [["public", "<NT>"], ["ε"]],
  "<NT>": [["<Interface_Var_Init>", "<NT>"], ["<Fun_Head>", "<NT>"], ["ε"]],
  "<Interface_Var_Init>": [["<Static>", "<Init>"], ["<Init>"]],
  "<Init>": [["DT", "ID", "=", "<Const>", ";"]],
  "<Fun_Head>": [["ID", "()", ":", "DT"]],
  "<Obj_dec>": [["ObjectType", "ID", "<O1>"]],
  "<O1>": [[";", "I", "=", "new", "ObjectType", "(", "<Parameters>", ");"]],
  "<Dot_st>": [["ID", ".", "<D1>"]],
  "<D1>": [
    ["<Object_operations>", "I", "<Operations>", "I", "<array_operations>"],
  ],
  "<Object_operations>": [["ID", "<Object_operations_tail>"]],
  "<Object_operations_tail>": [["<func_call>"], ["ε"]],
  "<array_operations>": [["length"]],
  "<Operations>": [
    ["<get_operation>"],
    ["<set_operation>"],
    ["<remove_operation>"],
    ["<clear_operation>"],
    ["<size_operation>"],
    ["<add_operation>"],
    ["<put_operation>"],
  ],
  "<add_operation>": [["add", "(", "<OE>", ")", ";"]],
  "<get_operation>": [["get", "(", "<index>", ")", ";"]],
  "<set_operation>": [["set", "(", "<index>", ",", "<const>", ")", ";"]],
  "<remove_operation>": [["remove", "(", "<index>", ")", ";"]],
  "<clear_operation>": [["clear", "(", ")", ";"]],
  "<size_operation>": [["size", "(", ")", ";"]],
  "<index>": [["int_const"]],
  "<put_operation>": [["put", "(", "<const>", ",", "<const>", ")", ";"]],
  "<get_operation>": [["get", "(", "<value>", ")", ";"]],
  "<remove_operation>": [["remove", "(", "<const>", ")", ";"]],
  "<size_operation>": [["size", "(", ")", ";"]],
  "<const>": [["int_const"], ["bool_const"], ["string_const"], ["char_const"]],
  "<OE>": [["<AE>", "<OE_prime>"]],
  "<OE_prime>": [["||", "<AE>", "<OE_prime>"], ["ε"]],
  "<AE>": [["<R>", "<AE_prime>"]],
  "<AE_prime>": [["&&", "<R>", "<AE_prime>"], ["ε"]],
  "<R>": [["<E>", "<R_prime>"]],
  "<R_prime>": [["<RO>", "<E>", "<R_prime>"], ["ε"]],
  "<E>": [["<T>", "<E_prime>"]],
  "<E_prime>": [["<PM>", "<T>", "<E_prime>"], ["ε"]],
  "<T>": [["<F>", "<T_prime>"]],
  "<T_prime>": [["<MDM>", "<F>", "<T_prime>"], ["ε"]],
  "<F>": [["<P>", "ID", "<F1>"], ["<Const>"], ["!", "<F>"]],
  "<F1>": [
    ["[", "<OE>", "]", "<F1>"],
    ["(", "<AL>", ")", "<F5>"],
    [".", "ID", "<F1>"],
    ["<inc_dec_Op>"],
    ["ε"],
  ],
  "<F5>": [[".", "ID", "<F1>"], ["[", "<OE>", "]", "<F1>"], ["ε"]],
  "<AL>": [["<Argument>", "<Next_Argument>"], ["ε"]],
  "<Argument>": [["<OE>"]],
  "<Next_Argument>": [[",", "<OE>"], ["ε"]],
  "<P>": [["this", "."], ["ε"]],
  "<Arrays>": [["<Array>", "ID", "<list>", "<array_init>"]],
  "<list>": [[",", "ID", "<list>"], ["ε"]],
  "<array_init>": [[";"], ["=", "<AI>"]],
  "<AI>": [
    ["{", "<list_values>", "}", ";"],
    ["new", "DT", "[", "int_const", "]", ";"],
  ],
  "<list_values>": [["<value>"], [",", "<value>", "<list_values>"], ["ε"]],
  "<array_use>": [["ID", "[", "int", "]", "<array_change_value>"]],
  "<array_change_value>": [[";", "I", "=", "{", "<value>", "}"]],
  "<List>": [
    ["<WDT>"],
    ["<ArrayList>", "<WDT>", "ID", "=", "new", "<ArrayList>", "<WDT>", ";"],
  ],
  "<WDT>": [["Integer"], ["String"], ["Boolean"], ["Float"], ["Character"]],
  "<arrayList>": [
    ["<ArrayList>", "<WDT>", "ID", "=", "new", "<ArrayList>", "<WDT>", ";"],
  ],
  "<HashMap>": [
    [
      "<HashMap>",
      "",
      "DT",
      ",",
      "DT",
      "",
      "ID",
      "=",
      "new",
      "<HashMap>",
      "",
      "DT",
      ",",
      "DT",
      "",
      ";",
    ],
  ],
}

const fs = require("fs")

// Read tokens from output.txt
const tokenData = fs.readFileSync("output.txt", "utf8")
const tokens = tokenData
  .split("\n")
  .map(line => {
    const matches = line.match(/\(([^,]+), ([^,]+), LineNo: (\d+)\)/)
    if (matches && matches.length === 4) {
      const [, valuepart, classpart, lineNo] = matches
      return { valuepart: valuepart.trim(), classpart, lineNo } // Trim spaces from valuepart
    }
    return null
  })
  .filter(token => token !== null)

console.log("tokens ", tokens)

let i = 0 // Global index to track current token

function parseProductionRule(productionRule, currentNonTerminal) {
  for (const symbol of productionRule) {
    if (symbol.startsWith("<")) {
      // It's a non-terminal, parse it recursively
      const nonTerminal = symbol.substring(1, symbol.length - 1)
      if (!parseNonTerminal(nonTerminal)) {
        console.log(
          `Failed to match ${symbol} at line ${tokens[i].lineNo} with token ${tokens[i].classpart} in ${currentNonTerminal} \n`
        )
        return false
      }
    } else {
      // It's a terminal symbol, check if it matches the current token
      if (tokens[i] && tokens[i].classpart === symbol) {
        console.log(`Matched ${symbol}`, " \n")
        // i++
      } else {
        console.log(
          `Failed to match ${symbol} at line ${tokens[i].lineNo} with token ${tokens[i].classpart} in ${currentNonTerminal}`
        )
        return false
      }
    }
  }
  return true // Successfully parsed the production rule
}

function parseNonTerminal(nonTerminal) {
  nonTerminal = nonTerminal.trim() // Trim spaces
  console.log("nonTerminal=", nonTerminal)
  console.log("i =", i)
  const selectionSet = selectionSets[nonTerminal]
  console.log("selectionSet", selectionSet)
  console.log(
    "selectionSet.includes(tokens[i].classpart",
    selectionSet.includes(tokens[i].classpart)
  )
  console.log("tokens[i].classpart", tokens[i].classpart)

  const currentIndex = i // Store the current index

  if (selectionSet.includes(tokens[i].classpart)) {
    console.log(
      `Parsing ${nonTerminal} with token ${tokens[i].classpart} at line ${tokens[i].lineNo}   \n `
    )

    // const productionRules = grammar[nonTerminal]
    const productionRules = grammar[`<${nonTerminal}>`]
    console.log(
      "Production rules for ",
      nonTerminal,
      ": ",
      productionRules,
      " \n"
    )

    let success = false
    for (const productionRule of productionRules) {
      success = parseProductionRule(productionRule, nonTerminal)
      if (success) {
        break // Successfully parsed one production rule
      }
    }
    ;``
    if (success) {
      //   i++ // Increment only if successfully parsed
      return true
    }
  }

  console.log(
    `Failed to match ${nonTerminal} at line ${tokens[currentIndex].lineNo} with token ${tokens[currentIndex].classpart} \n`
  )

  // Reset the index to the previous value after the recursive call
  i = currentIndex
  return false // Selection set didn't match
}

function parse() {
  const nonTerminals = Object.keys(grammar).map(nonTerminal =>
    nonTerminal.replace(/<|>/g, "")
  )
  //console.log("nonTerminals", nonTerminals)
  for (const nonTerminal of nonTerminals) {
    i = 0 // Reset the token index for each non-terminal
    console.log(`Parsing ${nonTerminal}...`)
    const success = parseNonTerminal(nonTerminal)

    if (!success) {
      console.log(`Failed to parse ${nonTerminal}.`)
      break // Stop parsing if any non-terminal fails
    } else {
      console.log(`Successfully parsed ${nonTerminal}.`)
    }
  }
}

// Start parsing
parse()
