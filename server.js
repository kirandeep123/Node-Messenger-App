var express =require('express');

var bodyParser =require('body-parser')
var app =express()
var http =require('http').Server(app)
var io =require('socket.io')(http)
var mongoose =require('mongoose')

app.use(express.static(__dirname))
app.use(bodyParser.json())

app.use(bodyParser.urlencoded({extended:false}))


var dbUrl ='mongodb+srv://user:user@cluster0-v8qrl.mongodb.net/test?retryWrites=true&w=majority'

var Message =mongoose.model('Message' ,{
    name:String,
    message:String
})

  
app.get('/messages',(req,res)=>{
 //   console.log(messages);
 Message.find({},(err,messages)=>{
    res.send(messages);

 })
})

  app.post('/messages',async (req,res)=>{
     var message =new Message(req.body)
             
      var savedMessage =await  message.save()
            console.log("saved");

            var censored=  await Message.findOne({message:'badword' })         
       
            if(censored)
               await  Message.remove({_id:censored.id})
            else
                io.emit('message',req.body)
            
            res.sendStatus(200);
        })
        //  .catch( (err) =>{
        //     res.sendStatus(500);
        //     return console.error(err); 
    


     
 //    console.log(req.body);
      

    
    io.on('connection',(socket) =>{
        console.log('user connected')
    })

    mongoose.connect(dbUrl,(err) =>{
        console.log('mongo db connection',err);
    })
var server =http.listen(3000, ()=>{
    console.log("server is listening to port  " +server.address().port)
});