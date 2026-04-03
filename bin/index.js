#!/usr/bin/env node

import { highlight } from 'cli-highlight';
import { getApiKey, setApiKey } from '../src/config.js';
import { ui, promptForApiKey, startSpinner, promptForQuery, printHeader, printStatus, streamText, promptForAuthorization } from '../src/ui.js';
import { generateResearch } from '../src/ai.js';
import { executeCommand } from '../src/executor.js';

async function bootstrap() {
    printHeader();

    // 1. Check for API key
    let apiKey = getApiKey();

    // 2. If no key, securely prompt and save
    if (!apiKey) {
        ui.warning('No API key found in local storage.');
        apiKey = await promptForApiKey();
        
        if (apiKey && apiKey.trim().length > 0) {
            setApiKey(apiKey.trim());
            ui.success('API key securely saved to local storage.');
            console.log();
        } else {
            ui.error('A valid API key is required to proceed. Terminating.');
            process.exit(1);
        }
    }

    // 3. Continuous REPL Loop
    while (true) {
        const query = await promptForQuery();

        if (!query || query.trim().toLowerCase() === 'exit') {
            ui.warning('Shutting down... Goodbye, Hacker.');
            break;
        }

        if (query.trim().toLowerCase() === 'clear') {
            printHeader();
            continue;
        }

        if (query.trim() === '') continue;

        const spinner = startSpinner();
        try {
            const result = await generateResearch(query);
            spinner.stop();
            
            // Format output beautifully and stream it chunk by chunk
            const highlighted = highlight(result, { language: 'markdown', ignoreIllegals: true });
            await streamText("\n" + highlighted + "\n");

            // Check for command string in [CMD: "command"] or [CMD: 'command']
            const commandMatch = result.match(/\[CMD:\s*["']([^"']+)["']\]/i);
            if (commandMatch) {
                const commandToRun = commandMatch[1];
                const isAuthorized = await promptForAuthorization(commandToRun);
                
                if (isAuthorized) {
                    const execSpinner = startSpinner(`Executing system command: ${commandToRun}...`);
                    const output = await executeCommand(commandToRun);
                    execSpinner.stop();
                    
                    console.log();
                    console.log(output);
                } else {
                    ui.warning('Execution aborted. Moving on.');
                    console.log();
                }
            }

            // Post action status
            printStatus();
        } catch (error) {
            spinner.stop();
            if (error.message.includes("API key")) {
                 ui.error(`Invalid API Key or Unauthenticated: ${error.message}`);
            } else {
                 ui.error(`Query Failed: ${error.message}`);
            }
            console.log();
        }
    }
}

bootstrap().catch(err => {
    ui.error(`Fatal execution error: ${err.message}`);
    process.exit(1);
});
