import * as fs from 'fs';

const inFile = './data/ds.txt';
const outFile = './data/ds2.txt';

function removePatternFromFile(inputFilePath: string, outputFilePath: string, pattern: RegExp) {
    const fileContent = fs.readFileSync(inputFilePath, 'utf-8');
    const modifiedContent = fileContent.replace(pattern, '');

    fs.writeFileSync(outputFilePath, modifiedContent, 'utf-8');
}

// Example usage:
const patternToRemove = /\*\*\b[A-Za-z0-9 \d\(\),:;-]*\*\*/g;
removePatternFromFile(inFile, outFile, patternToRemove);
