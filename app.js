const express = require("express");
const csrf = require("csurf");
// const csrf = require("tiny-csrf");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("some_secret"));
// app.use(csrf("123456789iamasecret987654321look", // secret -- must be 32 bits or chars in length
// ["POST", "PUT", "DELETE"]));
app.use(csrf({ cookie: true }));
const path = require("path");

app.set("view engine", "ejs");
// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async function (request, response) {
  const overdueItems = await Todo.overdue();
  const dueTodayItems = await Todo.dueToday();
  const dueLaterItems = await Todo.dueLater();
  const completedItems = await Todo.completed();
  if (request.accepts("html")) {
    response.render("index", {
      title: "Home page",
      overdueItems,
      dueTodayItems,
      dueLaterItems,
      completedItems,
      csrfToken: request.csrfToken(),
    });
  } else {
    response.json({
      overdueItems,
      dueTodayItems,
      dueLaterItems,
      completedItems,
      csrfToken: request.csrfToken(),
    });
  }
});

app.get("/signup", (request, response) => {
  response.render("signup", {
    title: "Signup",
    csrfToken: request.csrfToken(),
  });
});

app.get("/todos", async function (_request, response) {
  console.log("Processing list of all Todos ...");
  try {
    const todos = await Todo.findAll();
    response.send(todos);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async function (request, response) {
  try {
    await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
    });
    return response.redirect("/");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/", async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.setCompletionStatus(request.body.completed);
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async function (request, response) {
  console.log("Deleting a Todo with ID: ", request.params.id);
  try {
    await Todo.remove(request.params.id);
    return response.json({ success: true });
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

module.exports = app;
