const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = 3000;
const Budget = require("./models.js");
const Transaction = require("./transaction.js");
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

/*
  This is the route for creating a new budget.
  */
app.post("/budget", async (req, res) => {
  // give the budget title in req.body.title and
  // amount in req.body.amount and
  // expense in req.body.expense(should be an array and can be empty for now )
  try {
    const budget = await Budget.create(req.body);
    res.send(budget);
    const trans = await Transaction.create({
      name: "budget",
      type: "income",
      value: req.body.amount,
    });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

//  This is the route for creating a new expense in the budget.
app.post("/expense/:title", async (req, res) => {
  try {
    const expense = await Budget.findOneAndUpdate(
      { title: req.params.title },
      { $push: { expense: req.body.expense } },
      { new: true }
    );
    const budget = await Budget.findOneAndUpdate(
      { title: req.body.title },
      { $inc: { amount: -req.body.expense.amount } },
      { new: true }
    );
    const trans = await Transaction.create({
      name: req.body.expense.label,
      type: "expense",
      value: req.body.expense.amount,
    });
    res.send({ data: budget });
  } catch (err) {
    console.log(err);
  }
});

//  This is the route for updating a budget.

app.put("/budget", async (req, res) => {
  // give the budget title in req.params.title and new amount in req.body.amount
  try {
    const budget = await Budget.findOneAndUpdate(
      { title: req.body.title },
      { amount: req.body.amount },
      { new: true }
    );

    const trans = await Transaction.create({
      name: req.body.label,
      type: "income",
      value: req.body.amount,
    });
    // we can have a check here to see if the new amount is greater than the sum of all expenses
    res.send(budget);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

app.patch("/budget/:title", async (req, res) => {
  /*
  This is the route for updating a budget by adding an income.
  */
  // give the budget title in req.params.title and new income in req.body.income
  try {
    const budget = await Budget.findOneAndUpdate(
      { title: req.params.title },
      { $inc: { amount: req.body.amount } },
      { new: true }
    );
    console.log({ data: budget });
    const trans = await Transaction.create({
      name: req.body.label,
      type: "income",
      value: req.body.amount,
    });
    res.send(budget);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});
app.get("/budget/:title", async (req, res) => {
  /*
  This is the route for getting a budget.
  */
  // give the budget title in req.params.title
  try {
    const budget = await Budget.findOne({ title: req.params.title });
    res.send({ data: budget.amount });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

app.get("/expense/:title", async (req, res) => {
  /*
  This is the route for getting a budget's expenses.
  */
  // give the budget title in req.params.title
  try {
    const budget = await Budget.findOne({ title: req.params.title });
    res.send({ data: budget.expense });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

app.get("/category_expense/:title", async (req, res) => {
  try {
    const budget = await Budget.findOne({ title: req.params.title });
    const expense = budget.expense;
    const category = {};
    for (let i = 0; i < expense.length; i++) {
      if (category[expense[i].category]) {
        category[expense[i].category] += expense[i].amount;
      } else {
        category[expense[i].category] = expense[i].amount;
      }
    }
    res.send({ data: category });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

app.get("/transactionList", async (req, res) => {
  const trans = await Transaction.find({});
  res.send({ data: trans });
});

mongoose
  .connect(
    "mongodb+srv://harbansi:test123@cluster0-ypdnf.mongodb.net/expensetracker?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("error", err));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
