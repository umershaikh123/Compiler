


# Compiler Project

This repository contains a simple compiler project consisting of lexical analysis, syntax analysis, and semantic analysis components. The project is implemented in JavaScript.

## Files

1. **input.txt**
   - Input file for the custom language used in the compiler.

2. **output.txt**
   - Output file of the lexical analyzer, containing a set of tokens generated from the input.

3. **main.js**
   - JavaScript file containing the implementation of the lexical analyzer and syntax analyzer.
   - The syntax analyzer has a hard-coded CFG (Context-Free Grammar) that is customizable according to your specific language requirements.
   - to use your own cfg , update the Const grammer = { } according to your CFG . 

4. **semantic.js**
   - JavaScript file containing the implementation of the semantic analyzer.
   - Handles semantic analysis tasks, including scope checking, type checking, and error reporting.

5. **index.html**
   - HTML file for displaying the results of the semantic analysis.
   - Utilizes JavaScript to interact with the semantic analyzer and showcase analysis results.

## Running the Compiler

To run the compiler and perform lexical and syntax analysis, execute the following command in your terminal:

```bash
node main.js
```

## input

![image](https://github.com/umershaikh123/Compiler/assets/42178214/c4474cd6-2330-4421-aa48-3dcec956de08)


## Lexical Output

![image](https://github.com/umershaikh123/Compiler/assets/42178214/32eea652-de58-4d4a-9b16-8b3c688a433e)


## syntax Analysis (in terminal)

![image](https://github.com/umershaikh123/Compiler/assets/42178214/ec680cb1-fd71-4aa7-90aa-57a4d6af0688)


## semantic Analysis

![image](https://github.com/umershaikh123/Compiler/assets/42178214/909c3a34-cc68-493a-a213-8cd1547265a4)

![image](https://github.com/umershaikh123/Compiler/assets/42178214/c4d07cbd-71ca-4fe8-9dc6-11a927298756)

