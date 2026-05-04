require('dotenv').config();
const express      = require('express');
const path         = require('path');
const cookieParser = require('cookie-parser');
const nodemailer   = require('nodemailer');

const app  = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const mailer = nodemailer.createTransport({
  host:   process.env.SMTP_HOST || 'mail.butemine.ac.tz',
  port:   parseInt(process.env.SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.SMTP_USER || 'info@butemine.ac.tz',
    pass: process.env.SMTP_PASS || '',
  },
});

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
app.get('/academics',  (_req, res) => res.render('academics',  { page: 'academics' }));
app.get('/results',    (_req, res) => res.render('results',    { page: 'results' }));
app.get('/contact',    (_req, res) => res.render('contact',    { page: 'contact', sent: false, error: false }));

app.post('/contact', async (req, res) => {
  const { first_name, last_name, email, phone, enquiry_type, message } = req.body;
  const t = res.locals.t;
  try {
    await mailer.sendMail({
      from:    `"Butemine Website" <info@butemine.ac.tz>`,
      to:      'info@butemine.ac.tz',
      replyTo: email || undefined,
      subject: `[Website Enquiry] ${enquiry_type || 'General'} — ${first_name} ${last_name}`,
      html: `
        <h2 style="color:#8B2E00">New Message from Butemine Website</h2>
        <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px">
          <tr><td style="padding:8px;color:#555;width:140px"><strong>Name</strong></td><td style="padding:8px">${first_name} ${last_name}</td></tr>
          <tr style="background:#f9f9f9"><td style="padding:8px;color:#555"><strong>Phone</strong></td><td style="padding:8px">${phone}</td></tr>
          <tr><td style="padding:8px;color:#555"><strong>Email</strong></td><td style="padding:8px">${email || '—'}</td></tr>
          <tr style="background:#f9f9f9"><td style="padding:8px;color:#555"><strong>Enquiry Type</strong></td><td style="padding:8px">${enquiry_type || '—'}</td></tr>
          <tr><td style="padding:8px;color:#555;vertical-align:top"><strong>Message</strong></td><td style="padding:8px">${message.replace(/\n/g, '<br>')}</td></tr>
        </table>
        <p style="color:#999;font-size:12px;margin-top:20px">Sent from butemine.ac.tz contact form</p>
      `,
    });
    res.render('contact', { page: 'contact', sent: true, error: false });
  } catch (err) {
    console.error('Mail error:', err.message);
    res.render('contact', { page: 'contact', sent: false, error: true });
  }
});
app.get('/donate',     (_req, res) => res.render('donate',     { page: 'donate' }));

app.use((_req, res) => res.status(404).render('404', { page: '' }));

app.listen(PORT, () => {
  console.log(`Butemine School website running at http://localhost:${PORT}`);
});
