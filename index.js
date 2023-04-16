const express=require('express');
const app=express();
const mysql=require('./connection').con;

const session = require('express-session');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(session({
  secret: 'my-secret-key', // set a secret key for security
  resave: false, // do not save session if unmodified
  saveUninitialized: false, // do not create session until something is stored
}));

const port=3000;
//const Handlebars=require('handlebars');
app.set('view engine','hbs');
app.set('views','./view');
app.use(express.static(__dirname + "/public"));

// *********** ROUTING START  ***********
app.get('/',(req,res)=>{
    res.render('index');
});

app.get('/add',(req,res)=>{
    res.render('add');
});

app.get('/search',(req,res)=>{
    res.render('search');
});

app.get('/update',(req,res)=>{
    res.render('update');
});
app.get('/delete',(req,res)=>{
    res.render('delete');
});
// app.get('/view',(req,res)=>{
//     res.render('view');
// });

// ***************** ROUTING END ***********

// ************* FORM INSERTION **********


app.get('/view',(req,res)=>{
    //fetch data 
    let qr1="SELECT * FROM `student detail`";
    console.log(qr1);
    mysql.query(qr1,(err,result)=>{
        console.log(result);
        if(err)
        {
            throw err;
        }
        res.render("view",{data:result});
    });
});

app.get('/addstudent',(req,res)=>{
    //fetching data from form
    const {name,phone,email,gender}=req.query;
    
    //Sanitization XSS
    let qr1="SELECT * FROM `student detail` WHERE emailid=? or phoneno=?";
    mysql.query(qr1,[email,phone],(err,result)=>{
        if(err)
        throw err;
        else{
            if(result.length > 0)
            {
                res.render("add",{checkmesg:true});
            }
            else{
                //insert query
                let qr2="insert into `student detail` values(?,?,?,?) ";
                mysql.query(qr2,[name,phone,email,gender],(err,result)=>{
                    console.log(phone)
                    console.log(result)
                    if(result.affectedRows >0)
                    {
                        res.render("add",{mesg:true});
                    }
                });
                
            }
        }
    });
});

//SEARCHN STUDENT QUERY

app.get('/searchstudent',(req,res)=>{
    const {phone}=req.query;
    let qr1 ="select * from `student detail` where phoneno=?";
    //console.log(qr1);
    mysql.query(qr1,[phone],(err,result)=>{
        if(err)
        throw err;
        else{
            if(result.length>0)
            {
                console.log(result[0].name);
                res.render("search",{mesg1:true,mesg2:false,name:result[0].name});
            }
            else{
                res.render("search",{mesg1:false,mesg2:true});
            }
        }
    }); 
});


app.get('/updatesearch',(req,res)=>{
    //fetch data
    const {phone}=req.query;
    const qr1='select * from `student detail` where phoneno=?';
    mysql.query(qr1,[phone],(err,result)=>{
        if(err)
        {
            throw err;
        }
        else{

            if(result.length>0)
            {np
                 res.render('update',{mesg1:true,mesg2:false,data:result});
            }
            else{
                res.render('update',{mesg1:false,mesg2:true});
            }
        }
    });
});

app.get('/updatestudent',(req,res)=>{
    //fetch data
    const {name,phone,email,gender}=req.query;
    var qr1='update `student detail` set  name=?, emailid=?,gender=? where phoneno=?';
    mysql.query(qr1,[name,email,gender,phone],(err,result)=>{
        if(err)
        {
            throw err;
        }
        else{

            if(result.affectedRows>0)
            {
                res.render('update',{umesg:true});
            }
        }
    });
});



app.get('/', function(req, res) {
    if (req.session.views) {
      req.session.views++;
      res.setHeader('Content-Type', 'text/html');
      res.write('<p>Views: ' + req.session.views + '</p>');
      res.write('<p>Expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>');
      res.end();
    } else {
      req.session.views = 1;
      res.end('Welcome to this page for the first time!');
    }
  });

  app.get('/set-cookie', function(req, res) {
    res.cookie('mycookie', 'akash', { maxAge: 900000, httpOnly: true });
    res.send('Cookie is set');
  });
  

app.listen(port,(err)=>{
    if(err)
    {
        throw err;
    }
    console.log(`Server is running on port:${port}`);
});