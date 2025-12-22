import path from 'path';
import { app } from 'electron';

export const BASE_STORAGE_DIR = path.join(app.getPath('userData'), 'appdata');
