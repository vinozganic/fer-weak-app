import express from 'express';
import { escapeHtml } from '../utils/escapeHtml';
import { AppDataSource } from '../db';
import { HackerLogEntry } from '../entities/hackerLogEntry';

const router = express.Router();

router.get('/', (req: any, res: any) => {
    res.render('pages/homePage');
});

let xssVulnerabilityEnabled = true;

router.get('/xss', (req: any, res: any) => {
    res.render('pages/xssPage', {
        isAuthenticated: !!req.session.username,
        username: req.session.username,
        profileDescription: req.session.profileDescription,
        xssVulnerabilityEnabled,
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
    res.redirect('/xss');
});

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

export default router;
