const express      = require('express');
const path         = require('path');
const cookieParser = require('cookie-parser');

const app  = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(cookieParser());

// Language middleware — reads cookie, passes translations to every view
app.use((req, res, next) => {
  const lang = req.cookies.lang === 'sw' ? 'sw' : 'en';
  res.locals.t    = require(`./locales/${lang}.js`);
  res.locals.lang = lang;
  next();
});

// Language switch endpoint
app.get('/lang/:code', (req, res) => {
  const code = req.params.code === 'sw' ? 'sw' : 'en';
  res.cookie('lang', code, { maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: false });
  res.redirect(req.headers.referer || '/');
});

app.get('/logo.png', (_req, res) => {
  res.sendFile(path.join(__dirname, 'Butemine Logo.png'));
});

app.get('/',           (_req, res) => res.render('index',      { page: 'home' }));
app.get('/about',      (_req, res) => res.render('about',      { page: 'about' }));
app.get('/admissions', (_req, res) => res.render('admissions', { page: 'admissions' }));
app.get('/schools',    (_req, res) => res.render('schools',    { page: 'schools' }));
app.get('/gallery',    (_req, res) => res.render('gallery',    { page: 'gallery' }));
app.get('/news',       (_req, res) => res.render('news',       { page: 'news' }));
app.get('/results',    (_req, res) => res.render('results',    { page: 'results' }));
app.get('/contact',    (_req, res) => res.render('contact',    { page: 'contact' }));
app.get('/donate',     (_req, res) => res.render('donate',     { page: 'donate' }));

app.use((_req, res) => res.status(404).render('404', { page: '' }));

app.listen(PORT, () => {
  console.log(`Butemine School website running at http://localhost:${PORT}`);
});
