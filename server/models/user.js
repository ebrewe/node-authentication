const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//define model
const userSchema = new Schema({
  email: {type:String, unique:true, lowercase:true},
  password: String
});


//create model class
const Model = mongoose.model('user', userSchema);

//export the model
module.exports = Model;
