const User = require('../models/User');

// Skill ke hisaab se workers dikhana
exports.getWorkersBySkill = async (req, res) => {
  try {
    const { skill } = req.params;
    const { lat, lng, radius, area } = req.query;

    let workers;
    const searchRadius = radius ? parseInt(radius) : 20; // default 20km

    if (area && area.trim() !== '') {
      // Area naam se text search (case-insensitive)
      workers = await User.find({
        role: 'worker',
        skill: skill,
        'location.address': { $regex: area, $options: 'i' }
      });

    } else if (lat && lng) {
      // Coordinates se nearest search
      workers = await User.find({
        role: 'worker',
        skill: skill,
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(lng), parseFloat(lat)]
            },
            $maxDistance: searchRadius * 1000
          }
        }
      });

    } else {
      // Kuch bhi filter nahi — sab workers
      workers = await User.find({ role: 'worker', skill: skill });
    }

    res.render('workers', { workers, skill, lat, lng, radius: searchRadius, area: area || '' });

  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
};