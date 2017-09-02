/*
search up the path to find a .env file
*/

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

let envFile;
let lastPath;
let searchPath = process.cwd();
const envFilename = '.env';

while (lastPath !== searchPath && !envFile) {
    lastPath = searchPath;
    const dir = fs.readdirSync(searchPath);
    if (dir.indexOf(envFilename) !== -1) {
        envFile = path.resolve(searchPath, envFilename);
    }
    searchPath = path.resolve(searchPath, '..');
}

const result = dotenv.config({ path: envFile });
if (result.error) throw result.error;
