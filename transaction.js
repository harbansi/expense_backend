const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: "Enter a name for transaction",
  },
  type: {
    type: String,
    enum: ["income", "expense"],
    required: "Enter a type of transaction",
  },
  value: {
    type: Number,
    required: "Enter an amount",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
const Transaction = mongoose.model("transaction", TransactionSchema);

module.exports = Transaction;
