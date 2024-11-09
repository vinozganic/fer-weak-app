import express from 'express';
import path from 'path';
import session from 'express-session';
import routes from './routes/index';
import * as dotenv from 'dotenv';
import { AppDataSource } from './db';

dotenv.config();

AppDataSource.initialize()
    .then(() => {
        console.log('TypeORM Data Source has been initialized!');
    })
    .catch((err) => {
        console.error('Error during Data Source initialization', err);
    });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Changed to true

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Basic MemoryStore (intentionally vulnerable)
app.use(
    session({
        secret: 'weak-secret-key',
        resave: true,
        saveUninitialized: false,
        cookie: {
            secure: false,
            httpOnly: false,
        },
    })
);

// Cache control headers
app.use(function (req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/', routes);

// Default error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

export default app;
