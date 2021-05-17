let utility = require('../utility/utility'),
    constants = require("../utility/constants");

/*model start*/
let userTable = require('../model/user'),
    tasksTable = require('../model/tasks'),
    baseTable = require('../model/base');
/*model end*/

exports.login = async function (req,res) {
    let id = utility.stripTags(req.body.id),
        name = utility.stripTags(req.body.name),
        apiKey = utility.stripTags(req.body.apiKey);

    if(!apiKey){
        return res.sendStatus(401);
    }

    if(apiKey !== process.env.APIKEY){
        return res.sendStatus(403);
    }

    if(!name || !id){
        return res.sendStatus(400);
    }

    let saveUser = await baseTable.saveData(userTable.name,{
        name : name,
        id : id
    });

    if(!saveUser.success){
        return res.sendStatus(400);
    }

    let token = utility.generateAccessToken(saveUser.data);

    return res.send({token : token,name : name,image : ""});
}

exports.dashboard = async function (req,res) {
    let userId = req.user_id,
        totalTasks = await tasksTable.totalTasks(userId),
        tasksCompleted = await tasksTable.tasksCompleted(userId),
        tasks = await tasksTable.tasks(userId);
    return res.send({tasksCompleted : tasksCompleted,totalTasks : totalTasks,latestTasks : tasks});
}

exports.tasks = async function (req,res) {
    if(req.method === "GET"){
       let tasks = await tasksTable.tasks(userId);
        return res.send(tasks);
    }else if(req.method === "POST"){
        let name = utility.stripTags(req.body.name);
        if(!name){
            return res.sendStatus(400);
        }

        let saveData = await baseTable.saveData(tasksTable.name,{name : name,is_completed : 0,user_id : req.user_id});

        return res.send({name : name,completed : false,id : saveData.data});
    }else if(req.method === "PUT"){
        let id = utility.stripTags(req.params.id),
            taskName = utility.stripTags(req.body.name);
        await baseTable.updateData(tasksTable.name,{name : taskName},{id : id});
        return res.send({name : taskName,id : id});
    }else if(req.method === "DELETE"){
        let id = utility.stripTags(req.params.id);
        await tasksTable.delete(id);
        return res.send({success : true,id : id});
    }
}

exports.taskCompleted = async function (req,res) {
    let id = utility.stripTags(req.body.id),
        isCompleted = utility.stripTags(req.body.isCompleted);
    if(!id || !isCompleted){
        return res.sendStatus(400);
    }

    isCompleted = parseInt(isCompleted);

    let updateData = await baseTable.updateData(tasksTable.name,{is_completed : isCompleted},{id : id});

    return res.send({completed : isCompleted,id : id});
}
