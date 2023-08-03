const submitBut=document.getElementById("sub");
const inp=document.getElementById("task");
const prior=document.getElementById("priority");
const nt=document.getElementById("todo");
const fl=document.getElementById("fl");
let cnt=0;
let check=document.querySelectorAll(".checkbox");
submitBut.addEventListener("click",function(){
    event.preventDefault(); 
    let s="hello";
    console.log(s[2]);
    const todoTask=inp.value;
    const priority=prior.value;
    const checked=false;
    const image=fl.files[0];
    console.log(image);
    // if(!todoTask){
    //     alert('Please Enter a Task');
    // }
    // if(!image){
    //     alert('Please select an Image');
    // }
    // console.log(todotask);

    const todo={todoTask,priority,checked,image};
    const formData=new FormData();
    formData.append('todo',todoTask);
    formData.append('priority',priority);
    formData.append('checked',checked);
    formData.append('image',image);
    inp.value="";
    fl.value="";
    fetch("/todo",{
        method:"POST",
        // headers:{//headers are used with http to tell which type of data you are sending to process it reduces the computation of variety of types of files because you can send any form of data to the server
        //     "Content-Type": "application/json"
        // },
        // body:JSON.stringify(todo),
        body: formData,
    }).then(function(response){
        if(response.status === 200){
            return response.json();
        }else if(response.status===401){
            window.location.href="/login";
        }else{
            alert("Something Went Wrong");
        }
    }).then(function(tod){
        // tod.forEach(function(todo){
            showToDo(tod);
        // });
    });
});




function showToDo(todo){
    console.log(todo);
    const todoTextNode=document.createElement("div");
    todoTextNode.setAttribute("class", "flex-container");
    todoTextNode.setAttribute("id","pdiv"+cnt);
    const todo1=document.createElement("div");
    todo1.setAttribute("class", "box")
    todo1.setAttribute("id","divt"+cnt);
    todo1.innerText=todo.todo;
    const p1=document.createElement("div");
    p1.setAttribute("class", "box");
    p1.setAttribute("id", "divp"+cnt);
    p1.innerText=todo.priority;
    const c1=document.createElement("input");
    c1.setAttribute("type", "checkbox");
    c1.setAttribute("class","checkbox");
    c1.setAttribute("id","c"+cnt);
    if(todo.checked==='true'){
        c1.setAttribute("checked", "checked");
        p1.setAttribute("style","text-decoration:line-through");
        todo1.setAttribute("style","text-decoration:line-through");
        // markCheck(cnt);
    }
    const b1=document.createElement("button");
    b1.setAttribute("class","cross-button");
    b1.setAttribute("id","b"+cnt);
    b1.innerText="X";
    const img=document.createElement("img");
    img.setAttribute("src",todo.image);

    todoTextNode.appendChild(todo1);
    todoTextNode.appendChild(p1);
    todoTextNode.appendChild(img);
    todoTextNode.appendChild(c1);
    todoTextNode.appendChild(b1);
    nt.appendChild(todoTextNode);

    manageDelete(cnt);
    manageCheck(cnt);
    cnt++;


}



function manageDelete(cnt) {
    let but=document.getElementById("b"+cnt);
    let todoTask=document.getElementById("divt"+cnt).innerText;
    let priority=document.getElementById("divp"+cnt).innerText;
    let ddiv=document.getElementById("pdiv"+cnt);
    let checked=document.getElementById("c"+cnt).checked;
    const todo={todoTask,priority,checked};
    but.addEventListener("click",function() {
        event.preventDefault(); 
        console.log(but);
        console.log(ddiv);
        fetch("/del",{
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify(todo),


        }).then(function(response){
            if(response.status === 200){
                nt.removeChild(ddiv);
                
            }else if(response.status===401){
                window.location.href="/login";
            }else{
                alert("Something Went wrong");
            }
    
        });

    });


}

function manageCheck(cnt) {
    let ch=document.getElementById("c"+cnt);
    let t=document.getElementById("divt"+cnt);
    let p=document.getElementById("divp"+cnt);
    ch.addEventListener("change",function() {
        let todoTask=t.innerText;
        let priority=p.innerText;
        let checked=ch.checked;
        const checking={todoTask,priority,checked};
        fetch("/checker",{
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify(checking),


        }).then(function(response){
            if(response.status === 200){
                // nt.removeChild(ddiv);
                
                if(ch.checked){
        
                    t.style.textDecoration="line-through";
                    p.style.textDecoration="line-through";
                }else{
                    t.style.textDecoration="none";
                    p.style.textDecoration="none";
                }
            }else if(response.status===401){
                window.location.href="/login";
            }else{
                alert("Something Went wrong");
            }
    
        });




    });
}
function markCheck(cnt){
    let ch=document.getElementById("c"+cnt);
    let t=document.getElementById("divt"+cnt);
    let p=document.getElementById("divp"+cnt);
    t.style.textDecoration="line-through";
    p.style.textDecoration="line-through";
}

fetch("/todo-data").then(function(response){
    if(response.status === 200){
        return response.json();
    }else if(response.status===401){
        window.location.href="/login";
    }else{
        alert("Something Went Wrong");
    }
}).then(function(tod){
    tod.forEach(function(todo){
        showToDo(todo);
    });
});