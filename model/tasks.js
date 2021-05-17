let TABLE = "task",
    constants = require("../utility/constants"),
    utility = require("../utility/utility"),
    baseTable = require("./base");

module.exports = {
    name : TABLE,
    totalTasks : async function(userId){
        return await utility.getPool().query("select count(id) as count from "+TABLE+" where user_id = ?",[userId])
        .then(async function(results){
            let count = 0;
            if(results.length){
                count = results[0].count;
            }

            return count;
        })
    .catch(function(e){
            return 0;
        });
    },
    tasksCompleted : async function(userId){
        return await utility.getPool().query("select count(id) as count from "+TABLE+" where user_id = ? and is_completed = ?",[userId,1])
        .then(async function(results){
            let count = 0;
            if(results.length){
                count = results[0].count;
            }

            return count;
        })
    .catch(function(e){
            return 0;
        });
    },
    tasks : async function(userId){
        return await utility.getPool().query("select id,name,is_completed as completed,status from "+TABLE+" where user_id = ?",[userId])
        .then(async function(results){
            let data = [];
            if(results.length){
                for(let i = 0;i < results.length;i++){
                    data.push({
                        id : results[i].id,
                        name : results[i].name,
                        completed : (results[i].completed),
                        status : results[i].status
                    });
                }
            }

            return results;
        }).catch(function(e){
                return [];
        });
    },
    delete : async function(id){
        return await utility.getPool().query("DELETE FROM "+TABLE+" WHERE id = ?",[id])
        .then(async function(results){
            return true;
        }).catch(function(e){
            return false;
        });
    },
};