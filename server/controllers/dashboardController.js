const Note = require('../models/Notes');
const mongoose = require('mongoose');
const dashboardLayout = '../views/layouts/dashboard'
/**
 * GET /
 * Dashboard Page
 */
exports.dashboard = async (req, res) => {
  let perPage = 8;
  let page = req.query.page || 1;

  const locals = {
    title: "Dashboard",
    description: "Free NodeJs Notes App."
  };

  try {
    // Aggregate pipeline to sort, match, and project fields
    const notes = await Note.aggregate([{
      $sort: {
        updatedAt: -1
      }
    }, {
      $match: {
        user: new mongoose.Types.ObjectId(req.session.user._id)
      }
    }, {
      $project: {
        title: {
          $substr: ['$title', 0, 30]
        },
        body: {
          $substr: ['$body', 0, 100]
        },
      }
    }]).skip(perPage * page - perPage).limit(perPage).exec();

    // Count documents that match the user
    const countDocuments = await Note.countDocuments({
      user: req.session.user._id
    });

    res.render('dashboard/index', {
      userName: req.session.user.firstname,
      locals,
      notes,
      layout: dashboardLayout,
      current: page,
      pages: Math.ceil(countDocuments / perPage)
    });
  } catch (error) {
    console.log(error);

  }
};

/**
 * GET /
 * View spesific note
 */
exports.viewNote = async (req, res) => {
  const note = await Note.findById({
    _id: req.params.id
  }).where({
    user: req.session.user._id
  }).lean();

  if (note)
    res.render('dashboard/view-notes', {
      noteID: req.params.id,
      note,
      layout: dashboardLayout
    });
  else
    res.send("Something went wrong!");
};

/**
 * PUT /
 * Update spesific note
 */
exports.updateNote = async (req, res) => {
  try {
    await Note.findOneAndUpdate({
      _id: req.params.id,
    }, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now(),
    }).where({
      user: req.session.user._id
    });

    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
  }
};

/**
 * DELETE /
 * Delete spesific note
 */
exports.deleteNote = async (req, res) => {
  try {
    await Note.deleteOne({
      _id: req.params.id
    }).where({
      user: req.session.user._id
    });
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
  }
};

/**
 * GET /
 * Add Notes
 */
exports.addNote = async (req, res) => {
  res.render('dashboard/add', {
    layout: dashboardLayout
  });
};

/**
 * POST /
 * Add Notes
 */
exports.submitNote = async (req, res) => {
  try {
    req.body.user = req.session.user._id;
    await Note.create(req.body);
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
  }
};

/**
 * GET /
 * Search for noted
 */
exports.search = async (req, res) => {
  try {
    res.render('dashboard/search', {
      searchResults: '',
      layout: dashboardLayout
    });
  } catch (error) {
    console.log(error);
  }
};

/**
 * POST /
 * Search for noted
 */
exports.searchSubmit = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    const searchTermWithoutS_Chars = searchTerm.replace(/[^a-zA-z0-9 ]/g, '');

    const searchResults = await Note.find({
      $or: [{
        title: {
          $regex: new RegExp(searchTermWithoutS_Chars, 'i')
        },
        body: {
          $regex: new RegExp(searchTermWithoutS_Chars, 'i')
        }
      }],
    }).where({
      user: req.session.user._id
    });

    res.render('dashboard/search', {
      searchResults,
      layout: dashboardLayout
    })

  } catch (error) {
    console.log(error);
  }
};



exports.logout = (req, res) => {
  req.session.destroy(error => {
    if (error) {
      console.error(error);
      res.status(500).send('Error Logout');
    } else {
      res.clearCookie('connect.sid');
      res.redirect('/');
    }
  });
};