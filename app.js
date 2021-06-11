const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");



const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));

app.get("/",(req,res)=>{
    
    res.sendFile(__dirname+"/index.html");
});
app.post("/",(req,res)=>{

    const query = req.body.cityName;
    const apikey = "d4d79eafc70d951d9720e023f404df38";
    const url = "https://api.openweathermap.org/data/2.5/weather?appid="+apikey+"&q="+query+"&units=metric";
    https.get(url,(response)=>{
        console.log(response.statusCode);
        response.on("data",(data)=>{
        const weatherdata = JSON.parse(data);
        // console.log(weatherdata);
        const temp = weatherdata.main.temp;
        // console.log(temp);
        const des = weatherdata.weather[0].description;
        const city = weatherdata.name;
        const icon = weatherdata.weather[0].icon;
        const imageUrl = "http://openweathermap.org/img/wn/"+icon+"@2x.png";

        // console.log(des);
        res.write(`<p style="font-size: 50px; color:aqua;margin: 0 160px;
        ">The Weather is Currently : ${des}</p>`);
        res.write(`<h1 style=" font-size:40px color:black">The Temprature in ${city} is :  ${temp} Celcius</h1>`);
        res.write("<img src="+imageUrl+"></img>")
        res.send();
    })

    });

})




app.listen(process.env.PORT || 2500,()=>{
console.log("server Started");
});
