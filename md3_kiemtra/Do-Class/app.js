const fs = require('node:fs');
const express = require("express");
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"))



app.get("/", (req, res)=>{
    res.status(200).sendFile(`${__dirname}/public/index.html`)
});


// ex2
// b1
// app.get("/api/v1/todos", (req,res)=>{
//     fs.readFile(`${__dirname}/dev-data/todos.json`, (err, data) => {
//         if (err) throw err;
//         res.status(200).json(JSON.parse(data));
//     });
// });

app.get("/api/v1/todos", (req,res)=>{
    let dataQuery = req.query;
    console.log(dataQuery.per_page);
    fs.readFile(`${__dirname}/dev-data/todos.json`, (err, data) => {
        if (err) throw err;
        let todoData = JSON.parse(data);
        const result = todoData.filter(todoData => todoData.userId == dataQuery.per_page);
        // console.log(result);
        res.status(200).json(result);
    });
});
// b2
app.get("/api/v1/todos/:id", (req, res)=>{
    let dataId = req.params.id;
    // console.log(dataId);
    fs.readFile(`${__dirname}/dev-data/todos.json`, (err, data) => {
        if (err) throw err;
        let todoData = JSON.parse(data);
        let todo = todoData.find((e)=> e.id == dataId);
        // console.log(todo);
        res.status(200).json(todo);
    });
});

// b3
app.post("/api/v1/todos", (req, res)=>{
    let dataBody = req.body.title;
    // console.log(dataBody);
    fs.readFile(`${__dirname}/dev-data/todos.json`, (err, data) =>{
        if (err) throw err;
        let todoData = JSON.parse(data);
        let todoTitle = todoData.find((e)=> e.title == dataBody);
        if(todoTitle){
            res.status(200).json({message: 'Todo already exists'});
        } else {
            let  newPost = {
                ...req.body,
                userId: Number(req.body.userId),
                id: Number(req.body.id),
            };
            todoData.push(newPost);
            // console.log(newPost);
            fs.writeFile(`${__dirname}/dev-data/todos.json`, JSON.stringify(todoData), (err) =>{
                if(err){
                    console.log(err);
                } else{
                    res.status(200).json({message: "Create successfully"})
                };
            });
        };
    });
});

// b4
app.put("/api/v1/todos/:id", (req, res) => {
    let dataParamsId = req.params.id;
    // console.log(dataParamsId);
    fs.readFile(`${__dirname}/dev-data/todos.json`, (err, data) =>{
        if (err) throw err;
        let todoData = JSON.parse(data);
        let todoId = todoData.find((e)=> e.id == dataParamsId);
        // console.log(todoId);
        if(todoId){
            let todoIndex = todoData.indexOf(todoId)
            let  newPut = {
                ...req.body,
                userId: Number(req.body.userId),
                id: Number(req.body.id),
            };
            todoData[todoIndex] = newPut;
            // console.log(newPost);
            fs.writeFile(`${__dirname}/dev-data/todos.json`, JSON.stringify(todoData), (err) =>{
                if(err){
                    console.log(err);
                } else{
                    res.status(200).json({message: "Update successfully"});
                };
            });
            
        } else {
            res.status(200).json({message: 'Todo not found' });
        }
    });
});

// b5
app.delete("/api/v1/todos/:id", (req, res) => {
    let dataParamsId = req.params.id;
    fs.readFile(`${__dirname}/dev-data/todos.json`, (err, data) =>{
        if (err) throw err;
        let todoData = JSON.parse(data);
        let todoId = todoData.find((e)=> e.id == dataParamsId);
        if(todoId){
            let todoIndex = todoData.indexOf(todoId);
            todoData.splice(todoIndex, 1);
            fs.writeFile(`${__dirname}/dev-data/todos.json`, JSON.stringify(todoData), (err) =>{
                if(err){
                    console.log(err);
                } else{
                    res.status(200).json({message: "Delete successfully"});
                };
            });
        } else {
            res.status(200).json({message: 'Todo not found' });
        }
    })
})






function checkExist(req, res, next){
    if(req.params.id){
        let dataParamsId = req.params.id;
        fs.readFile(`${__dirname}/dev-data/todos.json`, (err, data) =>{
            if (err) throw err;
            let todoData = JSON.parse(data);
            let todoId = todoData.find((e)=> e.id == dataParamsId);
            if(!todoId){
                res.status(200).json({message: "User not found"})
            } else {
                next()
            }
        });     
    }
    else if (req.body){
        let dataBody = req.body.title;
        // console.log(dataBody);
        fs.readFile(`${__dirname}/dev-data/todos.json`, (err, data) =>{
            if (err) throw err;
            let todoData = JSON.parse(data);
            let todoTitle = todoData.find((e)=> e.title == dataBody);
            if(!todoTitle){
                next();
            } else {
                res.status(200).json({message: 'Todo already exists'});
            }
        })
    }
}

app.get("*", (req, res)=>{
    res.status(200).send("<h1>PAGE NOT FOUND</h1>")
})

app.listen(3000, ()=>{
    console.log('server listening on port http://127.0.0.1:3000');
})