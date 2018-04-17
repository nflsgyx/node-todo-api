const mongoose = require('mongoose');

var Todos = mongoose.model('todos',{
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completeted:{
    type: Boolean,
    default: false
  },
  completetedAt: {
    type: Number,
    default: false
  }
});

module.exports = {Todos};
