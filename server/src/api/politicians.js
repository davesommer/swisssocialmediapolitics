const { Router } = require('express');

const Politician = require('../models/politician');

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const entries = await Politician.find();
    res.json(entries);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const logEntry = new Politician(req.body);
    const createdEntry = await logEntry.save();
    res.json(createdEntry);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
