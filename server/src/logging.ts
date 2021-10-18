import winston from 'winston';
import ecsFormat from '@elastic/ecs-winston-format';

export const winstonLogger = winston.createLogger({
  format: ecsFormat(),
});

// export const morganMiddleware = winston.createLogger(ecsFormat(), {
//   skip: (req) => {
//     if (req.url === '/metrics') {
//       return true;
//     }
//     if (req.url?.endsWith('.svg')) {
//       return true;
//     }
//     if (req.url?.endsWith('.js')) {
//       return true;
//     }
//     if (req.url?.startsWith('/me')) {
//       return true;
//     }
//     if (req.url?.startsWith('/oauth2')) {
//       return true;
//     }
//     if (req.url?.startsWith('/internal')) {
//       return true;
//     }
//     return req.url === '/login';
//   },
// });
