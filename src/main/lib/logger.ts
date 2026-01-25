import path from 'path';
import { app } from 'electron';
import type Logger from 'electron-log';
import log from 'electron-log';

const logFormat: Logger.Format = ({ level, message }) => {
  const pid = process.pid;

  const date: Date = message.date ?? new Date();
  const timestamp = date.toISOString();

  const prefix = `[${pid}][${timestamp}][main][${level}]`;

  const flat = (Array.isArray(message.data) ? message.data : [message.data])
    .map((d) => (typeof d === 'string' ? d : JSON.stringify(d)))
    .join(' ');

  return [`${prefix} ${flat}`];
};

log.transports.file.format = logFormat;

log.transports.file.resolvePathFn = () => path.join(app.getPath('userData'), 'logs', 'main.log');
log.transports.file.maxSize = 5 * 1024 * 1024;

log.transports.console.level = false;

export const logger = log;

export default logger;
