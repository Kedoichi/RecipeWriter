const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

// GET all recipes
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const recipes = await db.collection('recipes')
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single recipe
router.get('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const recipe = await db.collection('recipes')
      .findOne({ _id: new ObjectId(req.params.id) });
      
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new recipe
router.post('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const recipe = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('recipes').insertOne(recipe);
    res.status(201).json({ 
      ...recipe, 
      _id: result.insertedId 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update recipe
router.put('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };
    
    const result = await db.collection('recipes')
      .findOneAndUpdate(
        { _id: new ObjectId(req.params.id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );

    if (!result.value) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(result.value);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE recipe
router.delete('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const result = await db.collection('recipes')
      .findOneAndDelete({ _id: new ObjectId(req.params.id) });

    if (!result.value) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;