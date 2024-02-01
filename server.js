const express=require("express");
const sql=require("mssql/msnodesqlv8");
const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

if (process.env.NODE_ENV==!"production"){
    require("dotenv").config();
}

// var config={
//     server:process.env.SERVER,
//     user:process.env.USER,
//     password:process.env.PASSWORD,
//     database:process.env.DATABASE,
//     driver: process.env.DRIVER,
//     options:{
//         trustedConnection:true,
//     },
// };

var config = {
    server: "LAPTOP-EIJ4CSVR\SQLEXPRESS",
    user: "sa",
    password: "mahesh201",
    database: "nodemysql",
    options: {
        trustedConnection: true,
        driver: "msnodesqlv8",
    },
};

const db=sql.connect(config,function(err){
    if (err){
        console.log(err);
    }else{
    console.log("Database Connected");
}
})

app.get("/getUserList",async function(req,res){
    let request=db.request();

    const result=await request.query("select * from tbl_users");
    res.json({msg:"fetch user successfully",data:result.recordsets})
})

app.post("/saveUser",async function(req,res){
    const request=db.request;

    request 
    .input("id",sql.Int,req.body.id)
    .input("name",sql.VarChar(20),req.body.name)
    .input("email",sql.VarChar(20),req.body.email)
    .input("mobile",sql.BigInt,req.body.mobile)
const q="insert into tbl_users(id,name,email,mobile) values(@id,@name,@email,@mobile)";
const result=request.query(q);
res.json({'msg':"save user successfully"})
})

app.put("/updateUser",async function(req,res){
    const request=db.request;

    request 
    .input("id",sql.Int,req.params.id)
    .input("name",sql.VarChar(20),req.body.name)
    .input("email",sql.VarChar(20),req.body.email)
    .input("mobile",sql.BigInt,req.body.mobile)
    await request.query("update tbl_users set name=@name,email=@email,mobile=@mobile where id=@id")
res.json({'msg':"update user successfully"})
})

app.delete("/deleteUser/:id",async function(req,res){
    let request=db.request();
    request.input("id",sql.Int,req.params.id)

    await request.query("delete from tbl_users where id=@id");
    res.json({'msg':"Record Deleted successfully"})
})
const PORT=process.env.PORT || 8085

app.listen(PORT, function () {
    console.log(`Server is running on port ${PORT}`);
});