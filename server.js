const express = require('express');
const app = express();
const fs=require('fs');
const multer  = require('multer')
var session = require('express-session');
const upload = multer({ dest: 'uploads/' })
//middleware to extract the dat came in th;e from of chunks and the buffer
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }
  }));
  const db=require('./model/db');
  const todoModel=require('./model/todo');
app.use(express.json());//take out the data and add in the request as the name of the body
app.use(express.urlencoded({extended:true}));
app.use(express.static('uploads'));
 

app.get('/', function (req, res) {
    if(!checkLoggedIn(req)){
        res.redirect('/login');
        return;
    }
    res.sendFile(__dirname + "/index.html");
});
app.get('/style.css', function (req, res) {
    if(!checkLoggedIn(req)){
        res.redirect('/login');
        return;
    }
    res.sendFile(__dirname + "/style.css");
});
app.get('/about', function (req, res) {
    if(!checkLoggedIn(req)){
        res.redirect('/login');
        return;
    }
    res.sendFile(__dirname + "/about.html");
});
app.get('/contact', function (req, res) {
    if(!checkLoggedIn(req)){
        res.redirect('/login');
        return;
    }
    res.sendFile(__dirname + "/contact.html");
});
app.get('/todo', function (req, res) {
    if(!checkLoggedIn(req)){
        res.redirect('/login');
        return;
    }
    res.sendFile(__dirname + "/todo.html");
});
app.get('/home', function (req, res) {
    if(!checkLoggedIn(req)){
        res.redirect('/login');
        return;
    }
    res.sendFile(__dirname + "/index.html");
});
app.get('/script.js', function (req, res) {
    if(!checkLoggedIn(req)){
        res.redirect('/login');
        return;
    }
    res.sendFile(__dirname + "/script.js");
});

app.get("/login",function (req, res) {
    res.sendFile(__dirname + "/login.html");
});




//handling login page

app.post("/login",function (req, res) {
    const username=req.body.username;
    const password=req.body.password;
    console.log(username,password);
    if(username=='n' && password=='n'){
        req.session.isLoggedIn=true;
        req.session.username=username;
        res.redirect('/');
        
    }else{
        res.status(401).send("error");
        res.redirect('/login');
        
    }

});

//Handling the post request from the client

app.post('/todo',upload.single('image'),function (dat, res) {
    if(!checkLoggedIn(dat)){
        res.status(401).send("error");
        return;
    }


    const todos={
        todo:dat.body.todo,
        priority:dat.body.priority,
        checked:dat.body.checked,
        image:dat.file.filename,
    };
    const req={todo:dat.body.todo,priority:dat.body.priority,checked:dat.body.checked,image:dat.file.filename};
    todoModel.create(todos).then(function(){
        res.status(200).json(req);
    }).catch(function(err){
        res.status(500).json({message:err.message+" Internal Server error"});
    });

    // console.log(upload.single(req.body.image));
    // console.log(dat.file);
    const req={todoTask:dat.body.todo,priority:dat.body.priority,checked:dat.body.checked,image:dat.file.filename};
    console.log(req);
    // console.log(typeof dat.body);
    // console.log(req.body.image);
    fs.readFile('todoTask.txt','utf-8',function(err, data){



    // // console.log(upload.single(req.body.image));
    // // console.log(dat.file);
    // console.log(req);
    // // console.log(typeof dat.body);
    // // console.log(req.body.image);
    // fs.readFile('todoTask.txt','utf-8',function(err, data){


    //     if(err) {
    //         res.status(500).json({message:err.message+" Internal Server error"});
    //         return;
    //     }

        try{
            data=JSON.parse(data);
            data.push(req);


    //     if(data.length===0){
    //         data="[]";
    //     }


    //     try{
    //         data=JSON.parse(data);
    //         data.push(req);

            fs.writeFile("todoTask.txt",JSON.stringify(data),function(err){
                if(err){
                    res.status(500).json({message:err.message+" Internal"});
                    return;
                }
                res.status(200).json(req);
            });



    //         fs.writeFile("todoTask.txt",JSON.stringify(data),function(err){
    //             if(err){
    //                 res.status(500).json({message:err.message+" Internal"});
    //                 return;
    //             }
    //             res.status(200).json(req);
    //         });




    //     }
    //     catch(err){
    //         res.status(500).json({message:err.message+" Internal Server error"});
    //         return;
    //     }


    // });

    console.log(req.body);
});


//handling get request from the client
app.get('/todo-data',function(req, res){

    if(!checkLoggedIn(req)){
        res.status(401).send("error");
        return;
    }

    todoModel.find({})
  .then((items) => {
    console.log(items);
    res.status(200).json(items);
    return;
  })
  .catch((err) => {
    console.error('Error reading data from the collection:', err);
    res.status(500).json({message:err.message+" Internal Server error"});
    return;
  });
    // readAllTodos(function(err, data){
    //     if(err){
    //         res.status(500).send("error");
    //         // console.log("error");
    //         return;
    //     }
    //     res.status(200).json(data);
    // });

    readAllTodos(function(err, data){
        if(err){
            res.status(500).send("error");
            // console.log("error");
            return;
        }
        res.status(200).json(data);
    });

});



app.post("/del",function(req, res){
    if(!checkLoggedIn(req)){
        res.status(401).send("error");
        return;
    }


    const todoDel=req.body.todoTask;
    todoModel.findOne({todo:todoDel})
  .then((document) => {
    if (document) {
      console.log('Found document:', document);
      const path="./uploads/"+document.image;
        fs.unlink(path, (err) => {
            if (err) {
              console.error('Error deleting file:', err);
            } else {
              console.log('File deleted successfully!');
            }
          });
    } else {
      console.log('No documents found in the collection.');
    }
  })
  .catch((err) => {
    console.error('Error finding document:', err);
  });

  todoModel.deleteOne({ todo: todoDel })
  .then((result) => {
    if (result.deletedCount === 1) {
      console.log('Document deleted successfully.');
      res.status(200).json("Document deleted successfully");
    } else {
        console.log('Document not found.');
        res.status(500).send("error");
        return;
    }
  })
  .catch((err) => {
    console.error('Error deleting document:', err);
    res.status(500).send("error");
        return;
  });
    // readAllToDel(req.body,function(err, data){
    //     if(err){
    //         res.status(500).send("error");
    //         console.log("error");
    //         return;
    //     }
    //     res.status(200).json(data);
    // });
});
app.post("/checker",function(req, res){
    if(!checkLoggedIn(req)){
        res.status(401).send("error");
        return;
    }


    const todoToUpdate = req.body.todoTask; // Replace this with the todo value you want to update
let newCheckedValue = req.body.checked; // Replace this with the new checked value (true or false)
// if(req.body.checked===true){
//     newCheckedValue="tru";
// }else{
//     newCheckedValue="true";
// }
console.log(todoToUpdate);
console.log(newCheckedValue);
// Update the 'checked' field for the document with the specified 'todo' value
todoModel.findOneAndUpdate({ todo: todoToUpdate }, { $set: { checked: newCheckedValue } })
  .then((updatedDocument) => {
    if (updatedDocument) {
      console.log('Document updated:', updatedDocument);
      res.status(200).json(updatedDocument);
      return;
    } else {
        res.status(500).send("error");
      console.log('Document not found.');
      return;
    }
  })
  .catch((err) => {
    console.error('Error updating document:', err);
  });




    // readAllToCheck(req.body,function(err, data){
    //     if(err){
    //         res.status(500).send("error");
    //         console.log("error");
    //         return;
    //     }
    //     res.status(200).json(data);
    // });
});




db.init().then(function(){
    console.log("db connected");
    app.listen(3000, function () {
        console.log("server is on at port 3000");
    });
}).catch(function(err){
    console.log(err);
});
















function readAllTodos(callback) {
    fs.readFile("todoTask.txt","utf-8",function(err,data){
        // 

        if(err) {
            callback(err);
            return;
        }
        if(data.length===0){ 
            data="[]";
        }

        try{
            data=JSON.parse(data);
            callback(null,data);
        }
        catch(err){
            callback(err);
        }

    });
}
function readAllToDel(obj,callback){
    fs.readFile("todoTask.txt","utf-8",function(err,data){
        console.log(typeof data)
        let k=JSON.parse(data);
       
        let it=0;
        let m={};
        for(const key in k){
            if(k[key].todoTask===obj.todoTask){
               
                break;
            }else{
                it++;
            }
        }
        const img=k[it].image;
        const path="./uploads/"+img;
        fs.unlink(path, (err) => {
            if (err) {
              console.error('Error deleting file:', err);
            } else {
              console.log('File deleted successfully!');
            }
          });
        k.splice(it,1);
       
        console.log(k);
        if(err) {
            callback(err);
            return;
        }
        if(data.length===0){ 
            data="[]";
        }

        try{

            fs.writeFile("todoTask.txt",JSON.stringify(k),function(err){
                if(err){
                    res.status(500).json({message:err.message+" Internal"});
                    return;
                }
                callback(null,data);
                // res.status(200).json({message:"Todo saved successFully"});
            });


            // data=JSON.parse(data);
        }
        catch(err){
            callback(err);
        }

    });
}



function readAllToCheck(obj,callback){
    fs.readFile("todoTask.txt","utf-8",function(err,data){
        console.log(typeof data);
        let k=JSON.parse(data);
        // console.log(k[2]);
        // k.splice(2,1);
        // console.log(k[2]);
        // console.log(typeof k)

        // delete k.obj;
        console.log(obj);
        for(const key in k){
            if(k[key].todoTask===obj.todoTask){
                console.log(k[key].checked);
                obj.checked=!obj.checked;
                // k[key]=obj;
                if(obj.checked===true){
                    k[key].checked="false";
                }else{
                    console.log("hello");
                    k[key].checked="true"; 
                }
                break;
            }
        }

        console.log(k);
        if(err) {
            callback(err);
            return;
        }
        if(data.length===0){ 
            data="[]";
        }

        try{

            fs.writeFile("todoTask.txt",JSON.stringify(k),function(err){
                if(err){
                    res.status(500).json({message:err.message+" Internal"});
                    return;
                }
                callback(null,data);
                // res.status(200).json({message:"Todo saved successFully"});
            });


            // data=JSON.parse(data);
        }
        catch(err){
            callback(err);
        }

    });
}

function checkLoggedIn(req){
    if(!req.session.isLoggedIn){
        return false;
    }else{
        return true;
    }
}





//Read Express-session Documentation