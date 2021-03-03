const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const port = new SerialPort('COM12', { baudRate: 115200 });
const parser = port.pipe(new Readline({ delimiter: '\n' }));

let fastify = require('fastify');
let app = fastify();
let cors = require('cors');
let helmet = require('fastify-helmet');
let serveStatic = require('serve-static');
let pow = require('point-of-view');
let ejs = require('ejs');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
let awsIot = require('aws-iot-device-sdk');
let io = require('socket.io')(app.server);

let fastifySession = require('fastify-session');
let fastifyCookie = require('fastify-cookie');
let fileUpload = require('fastify-file-upload');

app.register(fileUpload);
app.register(fastifyCookie);

app.use(serveStatic(__dirname+'/public'));
app.use(cors());
app.register(require('fastify-formbody'));
app.register(helmet);
app.register(pow,{
  engine:{ejs},
  templates:'views'
});


let device = awsIot.device({
   keyPath: 'credentials/8916406178-private.pem.key',
  certPath: 'credentials/8916406178-certificate.pem.crt',
    caPath: 'credentials/root-CA.crt',
  clientId: 'baala-stirrer',
      host: 'a1dwqhuuo6ioox-ats.iot.ap-south-1.amazonaws.com'
});


port.on("open", () => {
  console.log('Arduino Serial Port Open');
});

function writetoarduino(data){
  port.write(data, (err) => {
    if (err) {
       console.log('Error on write to Arduino: ', err.message);
    }
    console.log('Message Written to Arduino');
  });
}

let topics = ["baala-stirrer/state","baala-stirrer/count"];

device.on('connect', function() {
  console.log("Connected to AWS");
  device.subscribe(topics);
});

device.on("error",function(err){
  console.log("Error AWS",err);
});

device.on("message",function(topic,payload){
  let jobject = JSON.parse(payload.toString());
  
  if(topic==topics[0]){ 
	if(jobject["state"]=="start" || jobject["state"]=="stop"){
	   writetoarduino(jobject["state"]);
	}
	
  }
  
  if(topic==topics[1]){
     io.emit("count",jobject["count"]);
   }
  
});

parser.on('data', async (data) =>{
  if(!isNaN(data)){
	let ndata = data.replace(/(\r\n|\n|\r)/gm, "");
	if(parseInt(ndata)!=-1){
	    await device.publish("baala-stirrer/count",JSON.stringify({count:ndata}));
	}
  }
});

app.get("/monitor", (req,res)=>{
   res.view('dashboard.ejs');
});


app.post("/button", (req,res)=>{
  device.publish("baala-stirrer/state",JSON.stringify({"state":req.body["state"].toString()}));
  res.send({"status":"done"});
});

app.get("/",(req,res)=>{
  res.view("login.ejs");
});


app.listen(8080,'0.0.0.0');