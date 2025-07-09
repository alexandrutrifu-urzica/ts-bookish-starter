import express from 'express';
import 'dotenv/config';
import ConnectionPool from 'tedious-connection-pool';

import healthcheckRoutes from './controllers/healthcheckController';
import bookRoutes from './controllers/bookController';

const port = process.env['PORT'] || 31289;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});

/**
 * Tedious config
 */
const config = {
    userName: 'test',
    password: 'Parola123#',
    server: 'localhost', // or "localhost"
    options: {
        trustServerCertificate: true,
    },
};

const poolConfig = {
    min: 2,
    max: 4,
    log: true,
};

export const pool = new ConnectionPool(poolConfig, config);

pool.on('error', function (err) {
    console.error(err);
});

// export const connection = new Connection(config);
//
// connection.on('connect', function (err) {
//     if (err) {
//         console.log('Error: ', err);
//     }
// });
//
// connection.connect();

/**
 * Primary app routes.
 */
app.use('/healthcheck', healthcheckRoutes);
app.use('/books', bookRoutes);
