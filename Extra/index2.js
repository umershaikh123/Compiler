const fs = require('fs');

class Lexer {
  constructor(inputFilePath, outputFilePath) {
    this.inputFilePath = inputFilePath;
    this.outputFilePath = outputFilePath;
    this.keywords = ['int', 'string', 'char', 'boolean', 'double', 'Main', 'final', 'print', 'If', 'else', 'static', 'void', 'function', 'switch', 'case', 'default', 'break', 'continue', 'for', 'while', 'Array', 'ArrayList', 'Map', 'public', 'private', 'protected', 'abstract', 'interface', 'import', 'inherits', 'implements'];
    this.operators = ['+', '-', '*', '/', '%', '==', '!=', '>', '<', '>=', '<=', 'and', 'or', 'not', '=', '+=', '-=', '*=', '/=', '%='];
    this.punctuators = [';', '{', '}', '(', ')', ','];
    this.tokens = [];
  }

  isKeyword(word) {
    return this.keywords.includes(word);
  }

  isOperator(char) {
    return this.operators.includes(char);
  }

  isPunctuator(char) {
    return this.punctuators.includes(char);
  }

  tokenize() {
    const inputFileContent = fs.readFileSync(this.inputFilePath, 'utf-8');
    const lines = inputFileContent.split(/\r?\n/);

    for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
      const line = lines[lineNumber].trim();
      const words = line.split(/\s+/);

      for (const word of words) {
        if (this.isKeyword(word)) {
          this.tokens.push({ value: word, type: 'keyword', class: 'keyword', line: lineNumber + 1 });
        } else if (this.isOperator(word)) {
          this.tokens.push({ value: word, type: 'operator', class: 'operator', line: lineNumber + 1 });
        } else if (this.isPunctuator(word)) {
          this.tokens.push({ value: word, type: 'punctuator', class: 'punctuator', line: lineNumber + 1 });
        } else if (!isNaN(word)) { // Check if word is a number
          this.tokens.push({ value: word, type: 'number', class: 'literal', line: lineNumber + 1 });
        } else if (/^[a-zA-Z_]\w*$/.test(word)) { // Check if word is an identifier
          this.tokens.push({ value: word, type: 'identifier', class: 'identifier', line: lineNumber + 1 });
        } else {
          // Handle other cases like strings, comments, etc.
        }
      }
    }
  }

  writeTokensToFile() {
    const outputContent = this.tokens.map(token => `(${token.value} ${token.type}, ${token.class}, Line ${token.line})`).join('\n');
    fs.writeFileSync(this.outputFilePath, outputContent);
    console.log('Lexical analysis completed. Tokens written to', this.outputFilePath);
  }
}

// Usage
const lexer = new Lexer('input.txt', 'output.txt');
lexer.tokenize();
lexer.writeTokensToFile();
