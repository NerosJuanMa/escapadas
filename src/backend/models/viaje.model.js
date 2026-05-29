import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Apuesta al nivel correcto (sube un nivel desde 'models' hasta 'backend')
const FILE_PATH = path.join(__dirname, '..', 'viajes.json');

export const leerViajes = () => {
    try {
        const data = fs.readFileSync(FILE_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

export const guardarViajes = (viajes) => {
    fs.writeFileSync(FILE_PATH, JSON.stringify(viajes, null, 2), 'utf-8');
};
