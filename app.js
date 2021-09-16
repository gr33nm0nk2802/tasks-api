const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const tasks = [
    { id:1, name:"Brush"},
    { id:2, name:"Login" },
    { id:3, name:"Sleep"}
];

function validateTask(task){
    const schema = {
        name: Joi.string().min(4).max(10).required()
    }
    return Joi.validate(task, schema);
}

app.get('/',(req,res)=>{
    return res.send("Hello Welcome to Task API. Make requests to the /api/tasks");
});

app.get('/api/tasks',(req,res)=>res.send(tasks));
app.get('/api/tasks/:id',(req,res)=>{
    const task = tasks.find( tk => tk.id === parseInt(req.params.id));
    if(!task) return res.status(404).send("The task with the given id was not found");
    return res.send(task)
});

app.post('/api/tasks',(req,res)=>{

    const { error, value } = validateTask(req.body)
    if(error)
       return res.status(400).send(error.details[0].message);

    const task ={
        id: tasks.length+1,
        name: value.name
    }

    tasks.push(task);
    return res.send(task);
});

app.put('/api/tasks/:id',(req,res)=>{

    const task = tasks.find( tk => tk.id === parseInt(req.params.id));
    if(!task) return res.status(404).send("The task with the given id was not found");

    const { error, value } = validateTask(req.body)
    if(error)
       return res.status(400).send(error.details[0].message);
    
    task.name= value.name;
    return res.send(task)
});

app.delete('/api/tasks/:id',(req,res)=>{

    const task = tasks.find( tk => tk.id === parseInt(req.params.id));
    if(!task) return res.status(404).send("The task with the given id was not found");

    const index = tasks.indexOf(task);
    tasks.splice(index,1);

    return res.send(task)
});

port = process.env.PORT || 5000;
app.listen(port,()=>console.log(`Listening on http://localhost:${port}`));