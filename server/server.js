const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('./db/mongoose').mongoose;
const Todos = require('./model/todos').Todos;
const Users = require('./model/users').Users;

var app = new express();

app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
  var newTodo = new Todos({
    text: req.body.text
  });
  newTodo.save().then((doc)=>{
    console.log(JSON.stringify(doc,undefined,2));
    res.send(doc);
  },(err)=>{
    console.log('Unable to save to db',err);
    res.status(400).send(err);
  });
});

app.get('/todos',(req,res)=>{
  Todos.find().then((todos)=>{
    res.send({todos});
  },(err)=>{
    res.status(400).send(err);
  });
})

app.listen(3000,()=>{
  console.log('Starting server');
})

// var newUser = new Users({
//   email:'nflsgyx@163.com',
// });
//
// newUser.save().then((doc)=>{
//   console.log(JSON.stringify(doc,undefined,2));
// },(err)=>{
//   console.log('Unable to save to db',err);
// });

module.exports = {app};
