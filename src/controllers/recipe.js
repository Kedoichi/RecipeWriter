const Recipe = require("../models/recipe");

exports.createRecipe = async (req, res) => {
  try {
    const recipeData = {
      title: req.body.title,
      description: req.body.description,
      image: req.body.image,
      preparationTime: {
        total: req.body.preparationTime.total,
        preparation: req.body.preparationTime.preparation,
        cooking: req.body.preparationTime.cooking,
      },
      ingredients: req.body.ingredients,
      instructions: req.body.instructions.map((instruction, index) => ({
        step: instruction.step || index + 1,
        text: instruction.text,
      })),
      nutrition: {
        calories: req.body.nutrition.calories,
        carbs: req.body.nutrition.carbs,
        protein: req.body.nutrition.protein,
        fat: req.body.nutrition.fat,
      },
    };

    const recipe = new Recipe(recipeData);
    await recipe.save();

    res.status(201).json(recipe);
  } catch (error) {
    res.status(400).json({
      error: error.message,
      details: error.errors,
    });
  }
};

exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    const recipeData = {
      title: req.body.title,
      description: req.body.description,
      image: req.body.image,
      preparationTime: {
        total: req.body.preparationTime.total,
        preparation: req.body.preparationTime.preparation,
        cooking: req.body.preparationTime.cooking,
      },
      ingredients: req.body.ingredients,
      instructions: req.body.instructions.map((instruction, index) => ({
        step: instruction.step || index + 1,
        text: instruction.text,
      })),
      nutrition: {
        calories: req.body.nutrition.calories,
        carbs: req.body.nutrition.carbs,
        protein: req.body.nutrition.protein,
        fat: req.body.nutrition.fat,
      },
    };

    const recipe = await Recipe.findByIdAndUpdate(req.params.id, recipeData, {
      new: true,
      runValidators: true,
    });

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json(recipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
