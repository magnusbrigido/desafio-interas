const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.body;

  const userAlreadyExists = users.find(user => user.username === username);
 
  if(userAlreadyExists)
    return response.status(400).json({ error: "User already exists"});

  next();
}

app.post('/users', checksExistsUserAccount, (request, response) => {
  const { name, username } = request.body;

  const user = {
    id: uuidv4(),
    name,
    username
  };

  users.push(user);

  return response.status(201).json(user);
});

app.get('/users', (request, response) => {
  return response.json(users);
});

app.get('/users/:id', (request, response) => {
  const { id } = request.params;

  const user = users.find(user => user.id === id);

  if(!user)
    return response.status(404).json({ error: "User not found"});

  return response.json(user);
})


app.put('/users/:id', (request, response) => {
  const { id } = request.params;
  const { name, username } = request.body;

  const user = users.find(user => user.id === id);

  if(!user)
    return response.status(404).json({ error: "User not found"});
  
  user.name = name;
  user.username = username;
  
  return response.json(user);
});


app.delete('/users/:id', (request, response) => {
  const { id } = request.params;

  const userIndex = users.findIndex(user => user.id === id);

  if(userIndex === -1)
    return response.status(404).json({ error: "User not found"});

  const user = users.splice(userIndex, 1);

  return response.status(201).json(user);
});

module.exports = app;