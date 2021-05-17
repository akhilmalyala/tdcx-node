let constants = require("../utility/constants"),
    utility = require("../utility/utility");

module.exports = {
    saveData : async function(tableName,data){
        data.created_at = utility.getCurrentDate();
        data.updated_at = data.created_at;
        return await utility.getPool().query("INSERT INTO "+tableName+" SET ?",data)
            .then(function(results){
                return {
                    success: true,
                    data: results.insertId
                };
            })
            .catch(function(e){
                console.log(e);
                return {
                    success: false
                };
            });
    },
    updateData : async function(tableName,data,where){
        let record = [data,where],
            query = "UPDATE "+tableName+" SET ? WHERE ?";
        if(Object.keys(where).length > 1){
            let customWhere = [];
            for(let key of Object.keys(where)){
                customWhere.push({column : key,value : where[key],operator : "="});
            }
            let whereData = getWhereString(customWhere);
            query = "UPDATE "+tableName+" SET ? WHERE "+whereData.column;
            record = [data].concat(whereData.record);
        }

        data.updated_at = utility.getCurrentDate();

        return await utility.getPool().query(query,record)
            .then(function(results){
                return {
                    success: true
                };
            })
            .catch(function(e){
                return {
                    success: false
                };
            });
    },
    isTableFieldExists : async function(tableName,where){
        return await utility.getPool().query("select count(created_at) as count from "+tableName+" where ?",[where])
            .then(async function(results){
                let count = 0;
                if(results.length){
                    count = results[0].count;
                }

                return (count > 0);
            })
            .catch(function(e){
                return false;
            });
    }
};