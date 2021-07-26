const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

function dateManage(date){
    let days = ["Sunday" , "Monday" , "Tuesday" , "Wednesday" , "Thursday" , "Friday" , "Saturday"];
    let months = ["Jnauary" , "Feburary" , "March" , "April" , "May" , "June" , "July" , "August" , "September" , "October" , "November" , "December"];

    let year = date.getFullYear();
    let month = months[date.getMonth()];
    let date_ = date.getDate();
    let day = days[date.getDay()];

    return `${date_} ${month} (${day}), ${year}`;
}

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
        if(response.statusCode===404){
            // res.write(`<h1 style=" text-align:center; font-size:40px color:black"Enter Correct City Name </h1>`);
            res.sendFile(__dirname+"/failure.html");
        }
        else{
        response.on("data",(data)=>{
        const weatherdata = JSON.parse(data);
        // console.log(weatherdata.message);
        
        
        const temp = weatherdata.main.temp;
        
        const humi = weatherdata.main.humidity;
        const tempmax = weatherdata.main.temp_max;
        const tempmin = weatherdata.main.temp_min;
        // console.log(temp);
        const des = weatherdata.weather[0].description;
        const city = weatherdata.name;
        const icon = weatherdata.weather[0].icon;
        const imageUrl = "http://openweathermap.org/img/wn/"+icon+"@4x.png";

        // console.log(des);
        const todaydate = new Date();
        const today = (dateManage(todaydate));
        
        res.write(`<p 
        style="text-align:center;
        font-size: 30px
        "
        >${today}</p>`);
        res.write(`<p 
        style="text-align:center;
        font-size: 30px
        "
        >${city}, ${weatherdata.sys.country}</p>`);
        res.write(`<span><p style="font-size: 50px; color:red;margin: 0 160px;
        "> Weather is Currently : ${des}</p></span>
        
        `);
        res.write("<img src="+imageUrl+"></img>");
        res.write(`<h1 style=" text-align:center; font-size:40px color:black">The Temprature in ${city} is :  ${temp} Celcius</h1>`);

       
        res.write(`<h4 style=" text-align:center; font-size:20px color:black">
        Max-Temp :  ${tempmax} Celsius </h1>`);   
        res.write(`<h4 style=" text-align:center; font-size:20px color:black">
        Min-Temp :  ${tempmin} Celsius </h1>`);        
        res.write(`<h4 style=" text-align:center; font-size:20px color:black">The Humidity is :  ${humi} % </h1>`);
        res.send();
        
    })
}

    });

})




app.listen(process.env.PORT || 2500,()=>{
console.log("server Started");
});
