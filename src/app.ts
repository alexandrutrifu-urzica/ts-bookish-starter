import express from 'express';
import 'dotenv/config';
import { Connection, ConnectionConfiguration } from 'tedious';

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
const config: ConnectionConfiguration = {
    server: 'localhost', // or "localhost"
    options: {
        trustServerCertificate: true,
    },
    authentication: {
        type: 'default',
        options: {
            userName: 'test',
            password: 'Parola123#',
        },
    },
};

export const connection = new Connection(config);

connection.on('connect', function (err) {
    if (err) {
        console.log('Error: ', err);
    }
});

connection.connect();

/**
 * Primary app routes.
 */
app.use('/healthcheck', healthcheckRoutes);
app.use('/books', bookRoutes);
