const express = require('express');
const app = express();
const fs=require('fs');
//middleware to extract the dat came in the from of chunks and the buffer
app.use(express.json());//take out the data and add in the request as the name of the body


 

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html");
});
app.get('/style.css', function (req, res) {
    res.sendFile(__dirname + "/style.css");
});
app.get('/about', function (req, res) {
    res.sendFile(__dirname + "/about.html");
});
app.get('/contact', function (req, res) {
    res.sendFile(__dirname + "/contact.html");
});
app.get('/todo', function (req, res) {
    res.sendFile(__dirname + "/todo.html");
});
app.get('/home', function (req, res) {
    res.sendFile(__dirname + "/index.html");
});
app.get('/script.js', function (req, res) {
    res.sendFile(__dirname + "/script.js");
});



//Handling the post request from the client

app.post('/todo',function (req, res) {
    console.log(typeof req.body);

    fs.readFile('todoTask.txt','utf-8',function(err, data){

        if(err) {
            res.status(500).json({message:err.message+" Internal Server error"});
            return;
        }

        if(data.length===0){
            data="[]";
        }

        try{
            data=JSON.parse(data);
            data.push(req.body);


            fs.writeFile("todoTask.txt",JSON.stringify(data),function(err){
                if(err){
                    res.status(500).json({message:err.message+" Internal"});
                    return;
                }
                res.status(200).json({message:"Todo saved successFully"});
            });




        }
        catch(err){
            res.status(500).json({message:err.message+" Internal Server error"});
            return;
        }


    });

    console.log(req.body);
});


//handling get request from the client
app.get('/todo-data',function(req, res){
    readAllTodos(function(err, data){
        if(err){
            res.status(500).send("error");
            console.log("error");
            return;
        }
        res.status(200).json(data);
    });
});



app.post("/del",function(req, res){
    readAllToDel(req.body,function(err, data){
        if(err){
            res.status(500).send("error");
            console.log("error");
            return;
        }
        res.status(200).json(data);
    });
});
app.post("/checker",function(req, res){
    readAllToCheck(req.body,function(err, data){
        if(err){
            res.status(500).send("error");
            console.log("error");
            return;
        }
        res.status(200).json(data);
    });
});





app.listen(3000, function () {
    console.log("server is on at port 3000");
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
                k[key]=obj;
                if(obj.checked===true){
                    k[key].checked=false;
                }else{
                    console.log("hello");
                    k[key].checked=true; 
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
