const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const path = require("path");

app.set("view engine", "ejs");
// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async function (request, response) {
  const allTodos = await Todo.getTodos();
  if (request.accepts("html")) {
    response.render("index", { allTodos });
  } else {
    response.json(allTodos);
  }
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
    const todo = await Todo.addTodo(request.body);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.markAsCompleted();
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);
  try {
    // check if todo exists for given id
    let deleted = false;
    const todo = await Todo.findByPk(request.params.id);
    if (todo) {
      // Delete the todo with the given index
      await Todo.destroy({
        where: { id: request.params.id },
      });
      // Check the database any todo with given id is present
      const stillThere = await Todo.findByPk(request.params.id);
      // if todo is present, deletion failed so return false else return true
      deleted = stillThere ? false : true;
    } else {
      deleted = false;
    }
    return response.send(deleted);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

module.exports = app;
