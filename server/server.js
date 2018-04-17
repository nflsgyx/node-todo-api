const mongoose = require('./db/mongoose').mongoose;
const Todos = require('./model/todos').Todos;
const Users = require('./model/users').Users;

var newTodo = new Todos({
  text: 'first thing to do'
});

newTodo.save().then((doc)=>{
  console.log(JSON.stringify(doc,undefined,2));
},(err)=>{
  console.log('Unable to save to db',err);
});

var newUser = new Users({
  email:'nflsgyx@163.com',
});

newUser.save().then((doc)=>{
  console.log(JSON.stringify(doc,undefined,2));
},(err)=>{
  console.log('Unable to save to db',err);
});
