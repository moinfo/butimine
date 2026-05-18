const path    = require('path');
const fs_log  = require('fs');
fs_log.appendFileSync(path.join(__dirname, 'crash.log'), `[${new Date()}] Starting — NODE=${process.version} CWD=${process.cwd()} DIR=${__dirname}\n`);
process.on('uncaughtException', err => {
  fs_log.appendFileSync(path.join(__dirname, 'crash.log'), `[${new Date()}] CRASH: ${err.stack}\n\n`);
  process.exit(1);
});
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const fs      = require('fs');
const session = require('express-session');

const app  = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'butemine-admin-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 4 * 60 * 60 * 1000 },
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.get('/logo.png', (_req, res) => {
  res.sendFile(path.join(__dirname, 'Butemine Logo.png'));
});

const BASE = 'https://butemine.ac.tz';

app.get('/', (_req, res) => res.render('index', {
  page: 'home',
  title: 'Butemine School — Quality Primary Education in Tanzania',
  description: 'Butemine English Medium Pre & Primary School in Samunge, Ngorongoro District, Tanzania. Daycare, Nursery, and Primary (Std 1–7) for 209 students. Founded 2013.',
  canonical: BASE + '/',
}));

app.get('/about', (_req, res) => res.render('about', {
  page: 'about',
  title: 'About Us',
  description: 'Learn about Butemine Primary School — founded in 2013 by John Nedura and Grace Ginduri in Samunge Village, Tanzania. Our mission, vision, values, and community story.',
  canonical: BASE + '/about',
}));

app.get('/admissions', (_req, res) => res.render('admissions', {
  page: 'admissions',
  title: 'Admissions',
  description: 'Apply to Butemine English Medium School. Enrol in Daycare (ages 0–3), Nursery (ages 3–6), or Primary School (Std 1–7). Contact us for joining instructions and fee details.',
  canonical: BASE + '/admissions',
}));

app.get('/schools', (_req, res) => res.render('schools', {
  page: 'schools',
  title: 'Our Schools',
  description: 'Butemine operates 3 centres in Ngorongoro District — Samunge HQ, Sale Branch, and Jema Branch — serving 209 students across Tanzania\'s Ngorongoro–Serengeti ecosystem.',
  canonical: BASE + '/schools',
}));

app.get('/gallery', (_req, res) => res.render('gallery', {
  page: 'gallery',
  title: 'Photo Gallery',
  description: 'Photos of school life, students, events, and the community at Butemine School in Samunge Village, Ngorongoro District, Tanzania.',
  canonical: BASE + '/gallery',
}));

app.get('/news', (_req, res) => {
  const newsItems = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/news.json'), 'utf8'));
  res.render('news', {
    page: 'news',
    title: 'News & Updates',
    description: 'Latest news from Butemine Primary School — academic milestones, community events, volunteer stories, and school developments in Ngorongoro District, Tanzania.',
    canonical: BASE + '/news',
    newsItems,
  });
});

app.get('/results', (_req, res) => res.render('results', {
  page: 'results',
  title: 'Academic Results',
  description: 'Butemine School PSLE results: 4 consecutive Grade A years, 100% pass rate 2022–2025, and Best Primary School in Ngorongoro District 2022. Verified via NECTA.',
  canonical: BASE + '/results',
}));

app.post('/contact', (req, res) => {
  console.log('Contact form submission:', req.body);
  res.redirect('/contact?sent=1');
});

app.get('/contact', (_req, res) => res.render('contact', {
  page: 'contact',
  title: 'Contact Us',
  description: 'Contact Butemine School in Samunge, Tanzania. Call +255 788 384 699, email info@butemine.ac.tz, or send a message for admissions, volunteering, or general enquiries.',
  canonical: BASE + '/contact',
}));

app.get('/donate', (_req, res) => res.render('donate', {
  page: 'donate',
  title: 'Support Us',
  description: 'Donate to Butemine School — sponsor a child\'s education, fund classroom construction, or support teacher salaries. Bank transfer (NMB) or Airtel Money accepted.',
  canonical: BASE + '/donate',
}));

// ── Admin ──────────────────────────────────────────────────────────
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'butemine2024';
const NEWS_FILE      = path.join(__dirname, 'data/news.json');

function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) return next();
  res.redirect('/admin/login');
}

app.get('/admin',          (_req, res) => res.redirect('/admin/news'));

app.get('/admin/login',    (_req, res) => res.render('admin/login', { error: null }));

app.post('/admin/login',   (req, res) => {
  if (req.body.password === ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    return res.redirect('/admin/news');
  }
  res.render('admin/login', { error: 'Incorrect password.' });
});

app.get('/admin/logout',   (req, res) => { req.session.destroy(); res.redirect('/admin/login'); });

app.get('/admin/news', requireAdmin, (req, res) => {
  const newsItems = JSON.parse(fs.readFileSync(NEWS_FILE, 'utf8'));
  res.render('admin/news', { newsItems, saved: req.query.saved === '1' });
});

app.post('/admin/news/add', requireAdmin, (req, res) => {
  const { category, month, year, title, excerpt, color, featured } = req.body;
  const formattedDate = month + ' ' + year;
  const newsItems = JSON.parse(fs.readFileSync(NEWS_FILE, 'utf8'));
  newsItems.unshift({ category, date: formattedDate, title, excerpt, icon: 'M5 3l14 9-14 9V3z', color, featured: featured === 'on' });
  fs.writeFileSync(NEWS_FILE, JSON.stringify(newsItems, null, 2));
  res.redirect('/admin/news?saved=1');
});

app.get('/admin/news/edit/:index', requireAdmin, (req, res) => {
  const newsItems = JSON.parse(fs.readFileSync(NEWS_FILE, 'utf8'));
  const index = parseInt(req.params.index, 10);
  const item = newsItems[index];
  if (!item) return res.redirect('/admin/news');
  res.render('admin/edit', { item, index });
});

app.post('/admin/news/edit/:index', requireAdmin, (req, res) => {
  const { category, month, year, title, excerpt, color, featured } = req.body;
  const newsItems = JSON.parse(fs.readFileSync(NEWS_FILE, 'utf8'));
  const index = parseInt(req.params.index, 10);
  newsItems[index] = { ...newsItems[index], category, date: month + ' ' + year, title, excerpt, color, featured: featured === 'on' };
  fs.writeFileSync(NEWS_FILE, JSON.stringify(newsItems, null, 2));
  res.redirect('/admin/news?saved=1');
});

app.post('/admin/news/delete/:index', requireAdmin, (req, res) => {
  const newsItems = JSON.parse(fs.readFileSync(NEWS_FILE, 'utf8'));
  newsItems.splice(parseInt(req.params.index, 10), 1);
  fs.writeFileSync(NEWS_FILE, JSON.stringify(newsItems, null, 2));
  res.redirect('/admin/news');
});

app.use((_req, res) => res.status(404).render('404', { page: '' }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  fs_log.appendFileSync(path.join(__dirname, 'crash.log'),
    `[${new Date()}] REQUEST ERROR: ${req.method} ${req.url}\n${err.stack}\n\n`);
  res.status(500).send('<pre>' + err.message + '</pre>');
});

app.listen(PORT, () => {
  console.log(`Butemine School website running at http://localhost:${PORT}`);
});
