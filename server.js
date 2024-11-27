const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const session = require('express-session');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mhbz9060768',
    database: 'admin'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        throw err;
    }
    console.log('Connected to database');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src')));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/login.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = "SELECT * FROM admins WHERE username = ? AND password = ?";
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Error logging in:', err);
            return res.status(500).send('Error logging in');
        }
        if (results.length > 0) {
            req.session.loggedin = true;
            req.session.username = username;
            res.redirect('/update'); // Redirecting to the addMeatStorage page
        } else {
            res.send('Incorrect username and/or Password!');
        }
    });
});

app.get('/update', (req, res) => {
    if (req.session.loggedin) {
        res.sendFile(path.join(__dirname, 'src/addMeatStorage.html'));
    } else {
        res.redirect('/login');
    }
});


app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/addMeatStorage.html'));
});

app.post('/upload', upload.array('files'), (req, res) => {
    res.send('Files uploaded successfully!');
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error logging out:', err);
            return res.status(500).send('Error logging out');
        }
        res.redirect('/login');
    });
});


app.get('/Halal.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/contracts/Halal.json'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
