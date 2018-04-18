const mongoose = require('mongoose');

var Todos = mongoose.model('todos',{
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed:{
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: false
  }
});

module.exports = {Todos};
