import {
  utilities as nestWinstonModuleUtilities,
  WinstonModuleOptions,
} from 'nest-winston';
import * as winston from 'winston';

const prettyJson = winston.format.printf((info) => {
  if (info.message.constructor === Object) {
    info.message = JSON.stringify(info.message, null, 4);
  }
  return `${info.level}: ${info.message}`;
});

export const winstonConfig: WinstonModuleOptions = {
  levels: winston.config.npm.levels,
  level: 'verbose',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike(),
        winston.format.colorize(),
        winston.format.prettyPrint(),
        winston.format.splat(),
        winston.format.simple(),
        prettyJson,
      ),
    }),
    new winston.transports.File({
      level: 'verbose',
      filename: 'application.log',
      dirname: 'logs',
    }),
  ],
};
