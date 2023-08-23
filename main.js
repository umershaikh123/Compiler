const { log } = require('console');
const fs = require('fs');

class Lexer {
  constructor(inputFilePath, outputFilePath) {
    this.inputFilePath = inputFilePath;
    this.outputFilePath = outputFilePath;
    this.classification = {
      'DT': ['int', 'char', 'double'],
      'if': ['if'],
      'while': ['while'],
      'do': ['do'],
      'else': ['else'],
      'for': ['for'],
      'Switch': ['switch'],
      'case': ['case'],
      'default': ['default'],
      'CB': ['continue', 'break'],
      'return': ['return'],
      'void': ['void'],
      'main': ['main'],
      'abstract': ['abstract'],
      'boolean': ['boolean'],
      'String': ['string'],
      'class': ['class'],
      'new': ['new'],
      'AM': ['private', 'public', 'protected'],
      'static': ['static'],
      'final': ['final'],
      'print': ['print'],
      'extends': ['extends'],
      'implements': ['implements'],
      'interface': ['interface'],
      'import': ['import'],
      'functions': ['functions'],
      'A': ['Array', 'ArrayList'],
      'Map': ['Map'],
      'inherits': ['inherits'],
      'this': ['this'],
      ';': [';'],
      '{': ['{'],
      '}': ['}'],
      ',': [','],
      '/': ['/'],
      '/$': ['/$'],
      '$/': ['$/'],
      '(': ['('],
      ')': [')'],
      ':': [':'],
      '[': ['['],
      ']': [']'],
      '"': ['"'],
      "'": ["'"],
      '\\': ['\\'],
      '.': ['.'],
      '*': ['*', '/', '%'],
      '+': ['+', '-'],
      '<': ['<', '>', '<=', '>=', '!=', '=='],
      'AND': ['&&'],
      'OR': ['||'],
      'NOT': ['!'],
      'INC_DEC': ['++', '--'],
      '=': ['='],
      'ASSIGN_OP': ['+=', '-=', '*=', '/=', '%=']
    };
    this.tokens = [];
  }

  getClassPart(word) {
    for (const classPart in this.classification) {
      if (this.classification[classPart].includes(word)) {
        return classPart;
      }
    }
    return 'identifier';
  }

  // tokenize() {
  //   const inputFileContent = fs.readFileSync(this.inputFilePath, 'utf-8');
  //   const lines = inputFileContent.split(/\r?\n/);
  //   console.log("Lines : " ,lines , "\n" );

  //   for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
  //     const line = lines[lineNumber].trim();
  //     const words = line.split(/\s+/);
  //     console.log("line : " ,line , "\n" );
  //     console.log("words : " ,words , "\n" );

  //     for (const word of words) {
  //       const classPart = this.getClassPart(word);
  //       this.tokens.push({ value: word, class: classPart, line: lineNumber + 1 });
  //     }
  //   }
  //   console.log("tokens" , this.tokens);
  // }
  tokenize() {
    const inputFileContent = fs.readFileSync(this.inputFilePath, 'utf-8');
    const lines = inputFileContent.split(/\r?\n/);

    for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
      const line = lines[lineNumber].trim();
      const tokensInLine = line.split(/(\s+|;|,|\(|\)|{|}|\[|\]|"|'|\.\s*)/);

      for (const token of tokensInLine) {
        const cleanedToken = token.trim();
        if (cleanedToken === '') {
          continue;
        }
        const classPart = this.getClassPart(cleanedToken);
        this.tokens.push({ value: cleanedToken, class: classPart, line: lineNumber + 1 });
      }
    }
  }

// Token : ( value part , class part , lineNo)
  writeTokensToFile() {
    const outputContent = this.tokens.map(token => `( value part : ${token.value} , class part : ${token.class}, Line No : ${token.line})`).join('\n');
    fs.writeFileSync(this.outputFilePath, outputContent);
    console.log('Lexical analysis completed. Tokens written to', this.outputFilePath);
  }
}

// Usage
const lexer = new Lexer('input.txt', 'output.txt');
lexer.tokenize();

lexer.writeTokensToFile();
