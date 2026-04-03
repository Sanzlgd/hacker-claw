import ora from 'ora';
import chalk from 'chalk';
import inquirer from 'inquirer';

// Hacker-style UI components
export const ui = {
    header: (text) => console.log(chalk.cyan.bold(`\n=== ${text} ===\n`)),
    error: (text) => console.log(chalk.red.bold(`[ERROR] ${text}`)),
    success: (text) => console.log(chalk.green(`[SUCCESS] ${text}`)),
    warning: (text) => console.log(chalk.yellow(`[WARNING] ${text}`))
};

// AI request spinner
export const startSpinner = (text = '🕵️‍♂️ Deep diving into the mainframe...') => {
    return ora({
        text: chalk.cyan(text),
        color: 'cyan',
        spinner: {
            interval: 100,
            frames: [
                '  \\         /  ',
                '   \\       /   ',
                '    \\     /    ',
                '     \\   /     ',
                '      \\ /      ',
                '       V       '
            ]
        }
    }).start();
};

export const printHeader = () => {
    console.clear();
    console.log(chalk.bgCyan.black(' 🦞 Hacker Claw 2026.1.0 | user@machine ~ $ '));
    console.log();
    console.log(chalk.cyan.bold('Available Commands:'));
    console.log(`  ${chalk.green('research')}  ${chalk.dim('- Ask a question or search for information')}`);
    console.log(`  ${chalk.green('clear')}     ${chalk.dim('- Clear the terminal area and reprint header')}`);
    console.log(`  ${chalk.green('exit')}      ${chalk.dim('- Exit the application')}`);
    console.log();
    console.log(chalk.green('Status: System is ready.'));
    console.log();
};

export const printStatus = () => {
    console.log(chalk.dim('------------------------------------------------------------'));
    console.log(chalk.cyan.bold('Status:'));
    console.log(chalk.green('Command executed successfully.'));
    console.log(chalk.green('System is ready.'));
    console.log();
};

export const streamText = async (text, delay = 10) => {
    let isAnsi = false;
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === '\x1b') isAnsi = true;
        process.stdout.write(char);
        if (char === 'm' && isAnsi) {
            isAnsi = false;
            continue;
        }
        if (!isAnsi) {
            await new Promise(r => setTimeout(r, delay));
        }
    }
    console.log();
};

// Prompt for Secure Info
export const promptForApiKey = async () => {
    const answers = await inquirer.prompt([
        {
            type: 'password',
            name: 'apiKey',
            message: chalk.cyan('Gemini API key not found. Please enter your API Key:'),
            mask: '*'
        }
    ]);
    return answers.apiKey;
};

// Prompt for Continuous Query
export const promptForQuery = async () => {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'query',
            prefix: '',
            message: chalk.cyan('🦞 Hacker Claw | user@machine ~ $')
        }
    ]);
    return answers.query;
};

// Prompt for Command Authorization
export const promptForAuthorization = async (command) => {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'authorize',
            prefix: '',
            message: chalk.yellow(`⚠️ Automator wants to run: [${command}]. Authorize? (y/n)`)
        }
    ]);
    return answers.authorize.trim().toLowerCase() === 'y';
};
