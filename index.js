const express = require('express')
const jwt= require('jsonwebtoken')
const app = express()
const port = 3000
const users= require('../jwt/users.json')
app.use(express.json())
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/users',(req,res)=>{
    const arr=[]
    for(let i=0;i<users.length;i++){
        arr.push(users[i].firstName)
    }
    res.json(arr)
})
const seceret='1234'
app.post('/login', (req,res)=>{
    const firstName= req.body.firstName;
    const password= req.body.password;
    let userc=null;
    for(let i=0;i<users.length;i++){
        if(users[i].firstName==firstName&&users[i].password==password){
            userc=users[i];
            break;
        }
    }
    if(userc){
        const token= jwt.sign({firstName:userc.firstName,email:userc.email},seceret,{expiresIn: '1h'});
        res.json({message:"login successful", token:token});
    }
    else{
        res.json({message:"user not found"});
    }
})
app.get('/profile',(req,res)=>{
    const head= req.headers['authorization']
    const tokeng= head&&head.split(' ')[1];
    if(!tokeng){
        res.json({message:'token is missing'})
    }
    else{
        try{
            const obj=jwt.verify(tokeng,seceret);
            const a=obj.firstName;
            const b=obj.email;
            for(let i=0;i<users.length;i++){
                if(a==users[i].firstName&&b==users[i].email){
                    res.json(users[i]);
                    break;
                }
            }

        }
        catch(err){
            
                res.json({message:'token is incorrect'})
            
        }
    }
})
   
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
