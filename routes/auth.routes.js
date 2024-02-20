import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.models.js';

const router = express.Router()

// Login route
router.get('/login', (req, res) => {
    res.render('login');
});

// Register route
router.get('/register', (req, res) => {
    res.render('register');
});

// Handle register POST request
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.redirect('/register');
    }
});

// Handle login POST request
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        console.log('User:', user);
        console.log('Is user a Mongoose model instance?', user instanceof User); // should return true
        console.log("mongoose instance")

        if(!user) {
            console.log('User not found',user);
            return res.redirect('/login');
        }


        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            console.log('Incorrect password',user);
            res.redirect('/login');
        }

        if (user.isAdmin) {
            req.session.user = user;
            console.log('Admin user', req.session.user);
            return res.redirect('/dashboard');
        } else {
            console.log('User', req.session.user);
            req.session.user = user;
            return res.redirect('/'); // Redirect to another page if not an admin
        }

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal Server Error');
    }
});


router.get("/check", (req, res) => {
    console.log(req.session.user);
})

// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

export default router;




// 9999999999
// user2@email.com
// 12345678
// user2