const mysql=require('mysql');
const con =mysql.createConnection({
    host:"localhost",
    user:"maalik",
    password:"aOXFKZ1FIwxlx9L2",
    database:"crudops",
    port:"3306"
});
con.connect((err)=>{
    if(err)
    throw err;

    console.log("connection create");
});
module.exports.con= con;