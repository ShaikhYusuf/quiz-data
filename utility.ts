import * as fs from 'fs';
export interface MCQ {
    Id: number;
    question: string;
    optionList: string[];
    answer: number;
}

export class Utility {
    convertToJson(lines: string[]): MCQ[] {
   
        const mcqs: MCQ[] = [];
        let currentMCQ: Partial<MCQ> = {};
        let currentId = 1; // Start with ID 1
    
        lines.forEach(line => {
            if(line.trim() != '') {
            const idMatch = line.trim().match(/^(\d+)\./); // Match any number followed by a period at the start of the line
            if (idMatch) { // Check if it's a new question
                if (currentMCQ.question) {
                    mcqs.push(currentMCQ as MCQ); // Push the previous MCQ if exists
                    currentId++; // Increment ID for the next question
                }
                currentMCQ = { Id: currentId }; // Start a new MCQ with the current ID
                currentMCQ.question = line.trim().substring(idMatch[0].length).trim(); // Extract question text
            } else if (line.trim().startsWith('- Answer: ')) {
                const answerMatch = line.split(':');
                if (answerMatch) {
                    currentMCQ.answer = answerMatch[1].trim().charCodeAt(0) - 'A'.charCodeAt(0);
                }
            } else if (line.trim()) { // Non-empty line, assume it's an option
                if (!currentMCQ.optionList) {
                    currentMCQ.optionList = [];
                }
                currentMCQ.optionList.push(line.trim().substring(3));
            }
        }});
    
        if (currentMCQ.question) {
            mcqs.push(currentMCQ as MCQ); // Push the last MCQ
        }
    
        return mcqs;
    }

    verifyMCQStrings(mcqStrings: string[]): boolean {
        let retValue = false;
        for (let lineNumber = 0; lineNumber < mcqStrings.length; lineNumber++) {
    
            let mcqLine = mcqStrings[lineNumber].trim();
            // Requirement 0: Ignore blank line
            if (!mcqLine) {
                continue;
            }
    
            // Requirement 1: Check if the question starts with an integer
            const questionRegex = /^\d+\..*/;
            if (!questionRegex.test(mcqLine)) {
                console.log(`Line ${lineNumber + 1}: Does not start with an integer.`);
                return retValue;
            }
    
            // Requirement 2: Check if there are only 4 options starting with A, B, C, and D
            const optionsRegex = /^[A-D]\).*/;
            for (let j = 0; j < 4; j++) {
    
                lineNumber++;
                mcqLine = mcqStrings[lineNumber].trim();
    
                if (!optionsRegex.test(mcqLine)) {
                    console.log(`Line ${lineNumber + 1}: Option does not start with 'A/B/C/D:'.`);
                    return retValue;
                }
            }
    
            // Requirement 3: Check if the answer starts with "Answer:"
            lineNumber++;
            mcqLine = mcqStrings[lineNumber].trim();
            const answerRegex = /^- Answer:.*/;
            if (!answerRegex.test(mcqLine)) {
                console.log(`Line ${lineNumber + 1}: Answer does not start with 'Answer:'.`);
                return retValue;
            } 
            
        }

        retValue  = true;
        return retValue;
    }

    removeDuplicates (arr: MCQ[]): MCQ[] {

        //Filter the unique MCQs
        const uniqueQuestions = new Set<string>();
        let newMCQs =  arr.filter((obj) => {
          if (uniqueQuestions.has(obj.question)) {
            return false; // Duplicate, filter it out
          }
          uniqueQuestions.add(obj.question);
          return true; // Not a duplicate
        });

        //Assign the unique Id to each MCQs
        newMCQs.forEach((eachMCQ: MCQ, index: number) => {
            eachMCQ.Id = index + 1;
        });

        return newMCQs;
    }

    // Read the JSON file
    readJSONFile (filePath: string): MCQ[] {
        try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
        } catch (error: any) {
        console.error('Error reading JSON file:', error.message);
        return [];
        }
    }

    // Write the unique data back to the JSON file
    writeJSONFile (filePath: string, data: MCQ[]): void {
        try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log('Duplicates removed and written back to file:', filePath);
        } catch (error: any) {
        console.error('Error writing to JSON file:', error.message);
        }
    }
}
