const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todos} =require('./../model/todos');

 const todos = [{
   _id: new ObjectID(),
   text:'First test todo'
 },{
   _id: new ObjectID(),
   text:'Second test todo',
   completed:true,
   completedAt: 333
 }];


beforeEach((done)=>{
  Todos.remove({}).then(()=>{
    return Todos.insertMany(todos);
  }).then(()=>done());
});

describe('POST /todos',()=>{
  it('should create a new todo',(done)=>{
    var text = 'Test todo text';
    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res)=>{
        expect(res.body.text).toBe(text);
      })
      .end((err,res)=>{
        if (err){
          return done(err);
        }
        Todos.find({text}).then((todos)=>{
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e)=> done(e));
      });
  });
  it('should not create todo with invalid body data',(done)=>{
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err,res)=>{
        if (err){
          return done(err);
        }
        Todos.find().then((todos)=>{
          expect(todos.length).toBe(2);
          done();
        }).catch((e)=>done(e));
      });
  });
});

describe('GET /todos',()=>{
  it('should get all todos',(done)=>{
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res)=>{
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
})

describe('GET /todos/:id',()=>{
  it('should return todo doc',(done)=>{
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return 404 if todo not found',(done)=>{
    var hexID = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${hexID}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids',(done)=>{
    request(app)
      .get('/todos/123')
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id',()=>{
  it('should delete and return todo doc',(done)=>{
    request(app)
      .delete(`/todos/${todos[1]._id.toHexString()}`)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo._id).toBe(todos[1]._id.toHexString())
      })
      .end((err,res)=>{
        if (err){
          return done(err);
        };
        Todos.findById(todos[1]._id.toHexString()).then((todo)=>{
          expect(todo).toBe(null);
          done();
        },(err)=>done(err));
      });
  });

  it('should return 404 if todo not found',(done)=>{
    var hexID = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${hexID}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 if object id is invalid',(done)=>{
    request(app)
      .delete('/todos/123')
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id',()=>{
  it('should update the todo',(done)=>{
    var hexID = todos[0]._id.toHexString();
    var text = "This would be the new text";
    request(app)
      .patch(`/todos/${hexID}`)
      .send({
        completed:true,
        text
      })
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
      })
      .end(done);
  });
  it('should clear completedAt when todo is not completed',(done)=>{
    var hexID = todos[1]._id.toHexString();
    var text = "This would be the new text";
    request(app)
      .patch(`/todos/${hexID}`)
      .send({
        completed:false,
        text
      })
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.coompletedAt).toBe(undefined);
      })
      .end(done);
  });
});
