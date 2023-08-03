const mongoose = require('mongoose')
module.exports.init=async function(){
    await mongoose.connect('mongodb+srv://todo:lyPeud1J3BprOZyL@cluster0.rhxqls6.mongodb.net/?retryWrites=true&w=majority');
};