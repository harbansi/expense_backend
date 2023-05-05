const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BudgetSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  expense: [
    {
      label: {
        type: String,
        required: true,
        unique: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      category: {
        type: String,
        required: true,
      },
    },
  ],
});

const Budget = mongoose.model("Budget", BudgetSchema);

module.exports = Budget;
