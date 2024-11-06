import express from 'express';
import path from 'path';
import session from 'express-session';
import routes from './routes/index';
import FileStore from 'session-file-store';
import * as dotenv from 'dotenv';
import fs from 'fs';

// Initialize dotenv
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Initialize session file store
const fileStore = FileStore(session);
const sessionsPath = path.join(__dirname, '../sessions');
if (!fs.existsSync(sessionsPath)) fs.mkdirSync(sessionsPath);
app.use(
    session({
        store: new fileStore({
            path: sessionsPath,
        }),
        secret: process.env.SESSION_SECRET ?? 'default-secret',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: !!process.env.ENV_NAME },
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
