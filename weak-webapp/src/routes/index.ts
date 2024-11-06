import express from 'express';
import { handleErrorRoute } from '../utils/handleErrorRoute';

const router = express.Router();

let xssVulnerabilityEnabled = true;

// Route to render the page
router.get('/', (req: any, res: any) => {
    res.render('pages/xssPage', {
        isAuthenticated: !!req.session.username,
        username: req.session.username,
        customMessage: req.session.customMessage,
        xssVulnerabilityEnabled,
    });
});

// Route to handle login
router.post('/login', (req: any, res: any) => {
    req.session.username = req.body.username || 'Guest';
    res.redirect('/');
});

// Route to handle logout
router.post('/logout', (req: any, res: any) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

// Route to handle custom message submission
router.post('/message', (req: any, res: any) => {
    let customMessage = req.body.customMessage || '';
    if (!xssVulnerabilityEnabled) {
        customMessage = escapeHtml(customMessage);
    }
    req.session.customMessage = customMessage;
    res.redirect('/');
});

// Toggle XSS vulnerability
router.post('/toggle-xss', (req: any, res: any) => {
    xssVulnerabilityEnabled = !xssVulnerabilityEnabled;
    res.redirect('/');
});

// Simple HTML escape function
function escapeHtml(text: string) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export default router;
