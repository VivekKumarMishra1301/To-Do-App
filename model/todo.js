const mongoose=require('mongoose');
const todos=new mongoose.Schema({
    todo:String,
    priority:String,
    checked:String,
    image:String,
});

const todo=mongoose.model("todoTable",todos);
module.exports=todo;