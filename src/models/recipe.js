const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  image: {
    type: String,
    required: [true, 'Image is required']
  },
  preparationTime: {
    total: {
      type: String,
      required: [true, 'Total preparation time is required']
    },
    preparation: {
      type: String,
      required: [true, 'Preparation time is required']
    },
    cooking: {
      type: String,
      required: [true, 'Cooking time is required']
    }
  },
  ingredients: [{
    type: String,
    required: [true, 'Ingredients are required']
  }],
  instructions: [{
    step: {
      type: Number,
      required: [true, 'Step number is required']
    },
    text: {
      type: String,
      required: [true, 'Instruction text is required']
    }
  }],
  nutrition: {
    calories: {
      type: String,
      required: [true, 'Calories information is required']
    },
    carbs: {
      type: String,
      required: [true, 'Carbs information is required']
    },
    protein: {
      type: String,
      required: [true, 'Protein information is required']
    },
    fat: {
      type: String,
      required: [true, 'Fat information is required']
    }
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;