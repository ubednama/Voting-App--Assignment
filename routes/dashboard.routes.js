import express from 'express';
import Candidate from '../models/candidate.models.js';
import User from '../models/user.models.js';

const router = express.Router()

// Dashboard route
router.get('/', async (req, res) => {
  await User.updateMany({ isAdmin: true }, { $set: { voted: false } })
  .then(result => {
    console.log('Admin users updated successfully:', result);
  })
  .catch(err => {
    console.error('Error updating admin users:', err);
  });
    const user = req.session.user;
    if (!user || !user.isAdmin) return res.redirect('/login');
    const candidates = await Candidate.find();
    const users = await User.find({ voted: true });
    res.render('dashboard', { candidates, users });
});

export default router;