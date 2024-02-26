import fs from 'fs';
import path from 'path';

import {MCQ, Utility} from './utility'



let util: Utility = new Utility();

function processFile (inFilePath: string, outFilePath: string) {
    const mcqsLineList: string[] = fs.readFileSync(inFilePath, 'utf-8').split('\n');
    if(util.verifyMCQStrings(mcqsLineList)) {
        const mcqs: MCQ[] = util.convertToJson(mcqsLineList);
        const uniqueMCQs = util.removeDuplicates(mcqs);
        util.writeJSONFile(outFilePath, uniqueMCQs);
        return;
    }
}

function processFilesInDirectory(inPath: string): void {
    fs.readdir(inPath, (err, dirFileList) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        dirFileList.forEach((inFile) => {
            const filePath = path.join(inPath, inFile);

            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error('Error stating file:', err);
                    return;
                }

                if (stats.isFile() && inFile.endsWith('.txt')) {
                    const inFilePath = path.join(inPath, inFile);
                    const outFilePath = path.join(outPath, inFile.replace('txt', 'json'));
                    processFile (inFilePath, outFilePath);
                }
            });
        });
    });
}

// Specify the directory path here
const inPath = './data/original';
const outPath = './data/final';

// processFilesInDirectory(inPath);

const inFile = './data/original/comp-arch.txt';
const outFile = './data/final/comp-arch.json';

processFile(inFile, outFile);

