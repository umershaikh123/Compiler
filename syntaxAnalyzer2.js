const Grammar = {
  //Class:
  "<ClassDecl>": [
    [
      "<ClassAccMod>",
      "<ClassNonAccMod>",
      "class",
      "ID",
      "<Extra>",
      "{",
      "<ClassBody>",
      "}",
      "$",
    ],
  ],
  "<Extra>": [["extends"], ["Implements", "<InterfaceIDList>"], ["null"]],
  "<InterfaceIDList>": [["ID", "<listID>"]],
  "<listID>": [[",", "ID", "<listID>"], ["null"]],
  "<ClassBody>": [["<AM>", "<ClassBodyDecl>", "<ClassBody>"], ["null"]],
  "<ClassBodyDecl>": [
    ["ID", "(", "<Parameters>", ")", ":", "<C>"],
    ["<L>"],
    ["AM0", "<L>"],
    ["null"],
  ],
  "<C>": [
    ["{", "<Body>", "}"],
    // ["<return_type>", "{", "<Body>", "}"],
  ],
  "<L>": [["<abstract_fun>"], ["<Main_Func>"], ["<Attributes>"]],
  "<Parameters>": [["<Parameter>"], ["<parameter_list>"], ["null"]],
  "<parameter_list>": [[",", "<Parameter>", "<parameter_list>"], ["null"]],
  "<Parameter>": [["DT", "ID"]],
  "<Main_Func>": [["main", "(", ")", "{", "<Body>", "}"]],
  "<Attributes>": [["DT", "<A>"], ["<ArrayList>"], ["<HashMap>"]],
  "<A>": [["<Var>"], ["<Arrays>"]],
  "<abstract_fun>": [["abstract", "ID", "(", "<Arguments>", ")", ":", "DT"]],
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
  ],
  "<S>": [[".", "<S2>"]],
  "<S2>": [["<D1>"], ["<assign_st>"]],
  "<AM_st>": [["<AM>", "<NS>"]],
  "<NS>": [["AM0", "<ST>"], ["<ST>"]],
  "<ST>": [["<Attributes>"], ["ID", "<func_st>"]],
  "<MST>": [["<SST>", "<MST>"], ["null"]],

  //Var Dec+Init:
  "<Var>": [["ID", "<V>"]],
  "<V>": [["<Var_Dec>"], ["=", "<V2>"]],
  "<Var_Dec>": [[",", "ID", "<Var_Dec>"], [";"]],
  "<V2>": [["<assign_right>"]],

  //While loop:
  "<While_St>": [["while", "(", "<OE>", ")", "{", "<Body>", "}"]],

  //Do_While:
  "<Do_while_St>": [["do", "{", "<Body>", "}", "while", "(", "<OE>", ")", ";"]],

  //If_Else:
  "<if_else>": [
    ["if", "(", "<OE>", ")", "{", "<Body>", "}", "<O_if_Else>", "<O_Else>"],
  ],
  "<O_if_Else>": [["else if"], ["null"]],
  "<O_Else>": [["else"], ["null"]],

  //for St
  "<for_St>": [
    ["for", "(", "<Var>", ";", "<F2>", ";", "<F3>", ")", "{", "<Body>", "}"],
  ],
  "<F2>": [["<OE>"], ["null"]],
  "<F3>": [
    ["ID", "<F4>"],
    ["<inc_dec_Op>", "ID", ";"],
  ],
  "<F4>": [
    ["<inc_dec_Op>", ";"],
    ["=", "<assign_right>"],
  ],

  //Inc_Dec OP:
  "<inc_dec_Op>": [["++"], ["--"]],

  //Assignment_St:
  "<assign_st>": [["<assign_left>", "=", "<assign_right>"]],
  "<assign_left>": [[".", "FieldID"], ["null"]],
  "<assign_right>": [["<OE>", "<Z>"]],
  "<Z>": [[".", "<D1>"], ["null"]],

  //func St:
  "<func_St>": [
    ["(", "<Parameters>", ")", ":", "<return_type>", "{", "<Body>", "}"],
  ],
  //   "<Parameters>": [["<Parameter>"], ["<parameter_list>"], ["null"]],
  //   "<parameter_list>": [[",", "<Parameter>", "<parameter_list>"], ["null"]],
  //   "<Parameter>": [["DT", "ID"]],

  //Func Call:
  "<func_call>": [["(", "<Arguments>", ")"]],
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
  "<Interface_Body>": [["public", "<NT>"], ["null"]],
  "<NT>": [["<Interface_Var_Init>", "<NT>"], ["<Fun_Head>", "<NT>"], ["null"]],
  "<Interface_Var_Init>": [["<Static>", "<Init>"], ["<Init>"]],
  "<Init>": [["DT", "ID", "=", "<const>", ";"]],
  "<Fun_Head>": [["ID", "()", ":", "DT"]],

  //Class Obj_dec:
  "<Obj_dec>": [["DT", "ID", "<O1>"]],
  "<O1>": [[";", "I", "=", "new", "DT", "(", "<Parameters>", ");"]],

  //Dot:
  "<Dot_st>": [["ID", ".", "<D1>"]],
  "<D1>": [
    ["<Object_operations>"],

    ["<Common_operations>"],

    ["<ArrayList_operations>"],

    ["<HashMap_operations>"],

    ["<array_operations>"],
    ,
  ],
  "<Object_operations>": [["ID", "<Object_operations_tail>"]],
  "<Object_operations_tail>": [["<func_call>"], ["null"]],
  "<array_operations>": [["length"]],
  "<Common_operations>": [
    ["<get_operation>"],
    ["<remove_operation>"],
    ["<clear_operation>"],
    ["<size_operation>"],
  ],
  "<get_operation>": [["get", "(", "<go>", ")", ";"]],

  "<bsc_const>": [["bool_const"], ["string_const"], ["char_const"]],
  "<remove_operation>": [["remove", "(", "<go>", ")", ";"]],
  "<clear_operation>": [["clear", "(", ")", ";"]],
  "<size_operation>": [["size", "(", ")", ";"]],
  "<index>": [["int_const"]],
  "<go>": [["<index>"], ["<bsc_const>"]],
  "<ArrayList_operations>": [["<add_operation>"], ["<set_operation>"]],
  "<add_operation>": [["add", "(", "<OE>", ")", ";"]],
  "<set_operation>": [["set", "(", "<index>", ",", "<const>", ")", ";"]],

  "<HashMap_operation>": [["<put_operation>"]],
  "<put_operation>": [["put", "(", "<const>", ",", "<const>", ")", ";"]],

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
  "<F>": [["<P>", "ID", "<F1>"], ["<const>"], ["!", "<F>"]],
  "<F1>": [
    ["[", "<OE>", "]", "<F1>"],
    ["(", "<AL>", ")", "<F5>"],
    [".", "ID", "<F1>"],
    ["<inc_dec_Op>"],
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
  "<array_init>": [[";"], ["=", "<AI>"]],
  "<AI>": [
    ["{", "<list_values>", "}", ";"],
    ["new", "DT", "[", "int_const", "]", ";"],
  ],
  "<list_values>": [
    ["<const>", "<list_values>"],
    [",", "<const>", "<list_values>"],
    ["null"],
  ],
  "<array_use>": [["ID", "[", "int", "]", "<array_change_value>"]],
  "<array_change_value>": [[";", "I", "=", "{", "<const>", "}"]],

  //List:
  // "<WDT>": [["Integer"], ["String"], ["Boolean"], ["Float"], ["Character"]],
  "<arrayList>": [
    ["<ArrayList>", "WDT", "ID", "=", "new", "<ArrayList>", "WDT", ";"],
  ],

  //HashMap:
  "<HashMap>": [
    [
      "HashMap",

      "<",
      "WDT",
      ",",
      "WDT",
      ">",

      "ID",
      "=",
      "new",
      "HashMap",

      "<",
      "WDT",
      ",",
      "WDT",
      ">",

      ";",
    ],
  ],
}

// const Grammar = {
//   "<ClassDecl>": [
//     [
//       "<ClassAccMod>",
//       "<ClassNonAccMod>",
//       "class",
//       "ID",
//       "<Extra>",
//       "{",
//       "<ClassBody>",
//       "}",
//       "$",
//     ],
//   ],
//   "<Extra>": [["extends"], ["Implements"], ["null"]],
//   "<ClassBody>": [["<AM>", "<ClassBody>"], ["null"]],
//   "<ClassAccMod>": [["public"], ["private"], ["default"]],
//   "<ClassNonAccMod>": [["final"], ["abstract"], ["null"]],
//   "<AM>": [["public"], ["private"]],
// }
const fs = require("fs")

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

// const tokens = tokenData
//   .split("\n")
//   .map(line => {
//     // const matches = line.match(/\(([^,]+), ([^,]+), LineNo: (\d+)\)/)
//     const matches = line.match(/\(([^,]+), ([^,]+), LineNo: (\d+)\)/)

//     if (matches && matches.length === 4) {
//       const [, valuepart, classpart, lineNo] = matches
//       // return { valuepart, classpart, lineNo }
//       return { valuepart: valuepart.trim(), classpart, lineNo }
//     } else if (line.includes("( $ , $, Line: ")) {
//       return {
//         valuepart: "$",
//         classpart: "$",
//         lineNo: parseInt(line.match(/Line: (\d+)/)[1]),
//       }
//     }
//     return null
//   })
//   .filter(token => token !== null)

// const tokens = tokenData
//   .split("\n")
//   .map(line => {
//     const matches = line.match(/\(([^,]+), ([^,]+), LineNo: (\d+)\)/)
//     if (matches && matches.length === 4) {
//       const [, valuepart, classpart, lineNo] = matches
//       return { valuepart, classpart, lineNo }
//     } else if (line.includes("( $ , $, Line: ")) {
//       return {
//         valuepart: "$",
//         classpart: "$",
//         lineNo: parseInt(line.match(/Line: (\d+)/)[1]),
//       }
//     }
//     return null
//   })
//   .filter(token => token !== null)
let tokenIndex = 0

console.log("tokens ", tokens)
// console.log("tokens[0].classpart", tokens[0].classpart)
function parseNonTerminal(nonTerminal) {
  console.log(`Parsing non-terminal: ${nonTerminal}`)
  const productionRule = Grammar[nonTerminal]

  if (Array.isArray(productionRule)) {
    for (const rule of productionRule) {
      console.log(`Checking production rule: ${rule}`)
      let ruleIndex = 0
      let failed = false
      for (const symbol of rule) {
        if (symbol.startsWith("<")) {
          // It's a non-terminal
          console.log(`Processing non-terminal: ${symbol}  \n`)
          if (!parseNonTerminal(symbol)) {
            failed = true
            break
          }
        } else if (symbol !== "null") {
          // It's a terminal
          const currentToken = tokens[tokenIndex]
          console.log("currentToken", currentToken)
          //   console.log("currentToken.classpart", currentToken.classpart)
          if (currentToken && currentToken.classpart === symbol) {
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
        ruleIndex++
      }
      if (!failed) {
        return true // Successfully parsed the production rule
      }
    }
  }

  return false // All production rules failed
}

function parse() {
  const startSymbol = "<ClassDecl>"
  if (parseNonTerminal(startSymbol)) {
    console.log("Successfully parsed the input.")
  } else {
    console.log("Failed to parse the input.")
  }
}

// Start parsing
parse()
