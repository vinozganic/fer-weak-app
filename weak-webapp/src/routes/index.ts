import express from 'express';
import { escapeHtml } from '../utils/escapeHtml';
import { AppDataSource } from '../db';
import { HackerLogEntry } from '../entities/hackerLogEntry';
import { User } from '../entities/user';
import bcrypt from 'bcrypt';

const router = express.Router();

router.get('/', (req: any, res: any) => {
    res.render('pages/homePage');
});

// XSS Vulnerability

let xssVulnerabilityEnabled = true;

router.get('/xss', (req: any, res: any) => {
    res.render('pages/xssPage', {
        isAuthenticated: !!req.session.username,
        username: req.session.username,
        profileDescription: req.session.profileDescription,
        xssVulnerabilityEnabled,
        protocol: req.protocol,
        host: req.get('host')
    });
});

router.post('/login', (req: any, res: any) => {
    req.session.username = req.body.username || 'guest';
    res.redirect('/xss');
});

router.post('/logout', (req: any, res: any) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.redirect('/xss');
    });
});

router.post('/profileDescription', (req: any, res: any) => {
    let profileDescription = req.body.profileDescription || '';
    if (!xssVulnerabilityEnabled) {
        profileDescription = escapeHtml(profileDescription);
    }
    req.session.profileDescription = profileDescription;
    res.redirect('/xss');
});

router.post('/toggle-xss', (req: any, res: any) => {
    xssVulnerabilityEnabled = !xssVulnerabilityEnabled;
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.redirect('/xss');
    });
});

// Hacker's page

router.get('/mock-hacker-page', async (req: any, res: any) => {
    if (req.query.message) {
        const hackerLogEntry = new HackerLogEntry();
        hackerLogEntry.message = req.query.message;
        await AppDataSource.manager.insert(HackerLogEntry, hackerLogEntry);
    } else {
        const hackerLogEntries = await AppDataSource.manager.find(HackerLogEntry, {
            order: {
                created: 'DESC',
            },
        });
        res.render('pages/mockHackerPage', { hackerLogEntries });
    }
});

// Sensitive Data Exposure Vulnerability

let sdeVulnerabilityEnabled = true;

router.get('/sensitive-data-exposure', async (req: any, res: any) => {
    const users = await AppDataSource.manager.find(User);
    const loginError = req.query.loginError === 'true';
    const registerError = req.query.registerError === 'true';
    res.render('pages/sensitiveDataExposurePage', {
        isAuthenticated: !!req.session.usernameSde,
        username: req.session.usernameSde,
        sdeVulnerabilityEnabled,
        users,
        loginError,
        registerError,
    });
});

router.post('/register', async (req: any, res: any) => {
    const { username, password } = req.body;
    const users = await AppDataSource.manager.find(User);
    const foundUser = await AppDataSource.manager.findOne(User, { where: { username } });
    const newUser = new User();
    newUser.username = username;

    if (foundUser) {
        return res.redirect('/sensitive-data-exposure?loginError=false&registerError=true');
    }

    if (sdeVulnerabilityEnabled) {
        newUser.password = password;
    } else {
        const saltRounds = 10;
        newUser.password = await bcrypt.hash(password, saltRounds);
    }

    await AppDataSource.manager.save(newUser);

    req.session.usernameSde = username;
    res.redirect('/sensitive-data-exposure');
});

router.post('/login-sde', async (req: any, res: any) => {
    const { username, password } = req.body;
    const users = await AppDataSource.manager.find(User);
    const foundUser = await AppDataSource.manager.findOne(User, { where: { username } });

    if (!foundUser) {
        return res.redirect('/sensitive-data-exposure?loginError=true&registerError=false');
    }

    const match = await bcrypt.compare(password, foundUser.password);

    if (sdeVulnerabilityEnabled && foundUser.password !== password && !match) {
        return res.redirect('/sensitive-data-exposure?loginError=true&registerError=false');
    }

    req.session.usernameSde = username;
    res.redirect('/sensitive-data-exposure');
});

router.post('/logout-sde', (req: any, res: any) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.redirect('/sensitive-data-exposure');
    });
});

router.post('/toggle-sde', (req: any, res: any) => {
    sdeVulnerabilityEnabled = !sdeVulnerabilityEnabled;
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.redirect('/sensitive-data-exposure');
    });
});

export default router;
