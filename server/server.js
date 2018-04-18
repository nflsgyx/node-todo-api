const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const mongoose = require('./db/mongoose').mongoose;
const Todos = require('./model/todos').Todos;
const Users = require('./model/users').Users;

var app = new express();
const port = process.env.PORT || 3000;

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

app.get('/todos/:id',(req,res)=>{
  var id = req.params.id;
  if (!ObjectID.isValid(id)){
    return res.status(404).send();
  };
  Todos.findById(id).then((todo)=>{
    if (!todo) {
      res.status(404).send();
    } else {
      res.send({todo});
    }
  },(err)=>{
    res.status(400).send();
  });
});

app.delete('/todos/:id',(req,res)=>{
    var id = req.params.id;
    if (!ObjectID.isValid(id)){
      return res.status(404).send();
    };
    Todos.findByIdAndRemove(id).then((todo)=>{
      if (!todo){
        return res.status(404).send();
      }
      res.send({todo});
    }).catch((err)=>{
      res.status(400).send();
    });
});

app.listen(port,()=>{
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
