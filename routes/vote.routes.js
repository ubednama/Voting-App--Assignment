import express from 'express';
import fs from 'fs';
import path from 'path';
import Candidate from '../models/candidate.models.js';
import User from '../models/user.models.js';

const router = express.Router()

// const dataFilePath = path.join(__dirname, '../data.json');
// Get the directory path of the current module
// const dataFile = fs.readFileSync(dataFilePath);

// Voting page route
router.get('/', async (req, res) => {
    try {
        const user = req.session.user;

        if (!req.session.user) {
            return res.status(401).send('User not authenticated 1');
        }

        console.log("from vote route1 ",user)
        if (!user) return res.redirect('/login');
        const voted = user.voted;
        if (voted) return res.send(`
        <p>You already voted</p>
        <form action="/logout" method="GET">
            <button type="submit">Logout</button>
        </form>
    `);
        
        //getting candidates data
        //from mongoose
        const candidates = await Candidate.find();
        
        // const candidates = JSON.parse(dataFile);
        res.render('vote', { candidates });
    } catch (error) {
        console.error('Error reading data from data.json:', error);
        res.status(500).send('Internal Server Error');
    }
    
});

// Handle vote POST request
router.post('/', async (req, res) => {
    try {
        const user = req.session.user;
        const userId = req.session.user._id;
        console.log("user id",userId)

        if (!req.session.user) {
            return res.status(401).send('User not authenticated2');
        }
        console.log("from vote route2 ",user)
        if (!user) return res.redirect('/login');

        const voted = user.voted;
        if (voted) return res.send(`
            <p>You already voted</p>
            <form action="/logout" method="GET">
                <button type="submit">Logout</button>
            </form>
            `);

        const { candidateId } = req.body;
        await Candidate.updateOne({ _id: candidateId }, { $inc: { votes: 1 } });

        console.log("line 67 ",user)
        // await User.updateOne
        // user.voted = true;/
        // User.updateOne({ _id: userId }{ $set: { voted: true } })
        await User.updateOne({ _id: userId }, { $set: { voted: true } });
        console.log("line 73 ",user)
        // if (!(user instanceof User)) {
        //     return res.status(400).send('Invalid user object');
        // }

        // await user.save();

        res.send(
            `<p>Vote submitted successfully</p>
                <form action="/logout" method="GET">
                    <button type="submit">Logout</button>
                </form>
        `);
    } catch (error) {
        console.error('Error processing vote:', error);
        res.status(500).send('Internal Server Error');
    }
    
});

export default router;