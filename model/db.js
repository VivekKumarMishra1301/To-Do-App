const mongoose = require('mongoose')
module.exports.init=async function(){
    await mongoose.connect('mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority');
};