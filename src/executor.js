import { exec } from 'node:child_process';
import util from 'node:util';

const execAsync = util.promisify(exec);

export const executeCommand = async (command) => {
    try {
        const { stdout, stderr } = await execAsync(command, { timeout: 30000 });
        return stdout || stderr;
    } catch (error) {
        return `Error executing command: ${error.message}`;
    }
};
