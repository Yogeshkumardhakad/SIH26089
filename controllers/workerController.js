const User = require('../models/User');

// Skill ke hisaab se workers dikhana
exports.getWorkersBySkill = async (req, res) => {
  try {
    const { skill } = req.params;

    const workers = await User.find({ role: 'worker', skill: skill });

    res.render('workers', { workers, skill });

  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
};