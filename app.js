const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;

const changelogs = [];
const app = express();

// Ustawienia silnika widoków
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    secret: 'some secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new DiscordStrategy({
    clientID: '889103391911985193',
    clientSecret: 'pfDTDOjaq_OO9zI0dVtuBzL3fg2HIe4h',
    callbackURL: 'http://45.156.84.121:25567/auth/discord/callback',
    scope: ['identify', 'guilds']
}, function(accessToken, refreshToken, profile, done) {
    // Tutaj możemy dodać dodatkowe sprawdzenie roli użytkownika
    const hasRequiredRole = profile.guilds.some(g => g.id === '1129068497511661751' && (g.permissions & (1 << 3) || g.permissions & (1 << 2)));
    if (hasRequiredRole) {
        return done(null, profile);
    } else {
        return done(null, false);
    }
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index', { user: req.user, changelogs: changelogs || [], iconURL: 'URL-ikonki-serwera' });
});

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});


// Dodajemy funkcję sprawdzającą uprawnienia
function checkAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.render('error'); // Używamy naszego nowego widoku błędu
}

app.get('/changelogs', checkAuth, (_req, res) => {
  res.json(changelogs);
});

app.post('/changelogs', checkAuth, (req, res) => {
  changelogs.push(req.body);
  res.status(200).send('Changelog dodany pomyślnie!');
});

app.get('/auth/discord', passport.authenticate('discord'));
app.get('/auth/discord/callback', passport.authenticate('discord', { failureRedirect: '/' }), (_req, res) => {
  res.redirect('/'); // Przekieruj użytkownika po udanej autentykacji
});

app.listen(25567, () => {
  console.log('Serwer nasłuchuje na porcie 25567');
});
