const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.get('/logo.png', (_req, res) => {
  res.sendFile(path.join(__dirname, 'Butemine Logo.png'));
});

app.get('/',           (_req, res) => res.render('index',      { page: 'home' }));
app.get('/about',      (_req, res) => res.render('about',      { page: 'about' }));
app.get('/admissions', (_req, res) => res.render('admissions', { page: 'admissions' }));
app.get('/schools',    (_req, res) => res.render('schools',    { page: 'schools' }));
app.get('/gallery',    (_req, res) => res.render('gallery',    { page: 'gallery' }));
app.get('/contact',    (_req, res) => res.render('contact',    { page: 'contact' }));

app.use((_req, res) => res.status(404).render('404', { page: '' }));

app.listen(PORT, () => {
  console.log(`Butemine School website running at http://localhost:${PORT}`);
});
