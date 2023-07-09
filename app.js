//jshint esversion: 6 

const express = require("express");
const bodyParser = require("body-parser");
//const request = require("request");
const https = require("https");

const app = express() ;

app.use(express.static("public")) ; 
app.use(bodyParser.urlencoded({extended : true}));

app.get("/", function(req , res){
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req , res){

    var fName = req.body.fname ; 
    var lName = req.body.lname ;
    var email = req.body.email ; 

    var data = {
        members: [
            {
                email_address: email, 
                status: "subscribed",
                merge_fields: {
                    FNAME: fName ,
                    lName: lName 
                }
            }
        ]
    };

    var jsonData = JSON.stringify(data);

    const url = "https://us13.api.mailchimp.com/3.0/lists/33cdb8b5c2";

    const options = {
        method: "POST",
        auth: "indra:4f90a2ea3bbbf059a6e930bc4838f40c-us13"
    }

    const request1 = https.request(url , options , function(response){

        // if(response.statusCode == 200  &&  JSON.error_count == 0){   //&&  JSON.error_count == 0
        //     res.sendFile(__dirname + "/success.html")
        // } else {
        //     res.sendFile(__dirname + "/failure.html")
        // }


        response.on("data" , function(data){
             console.log(JSON.parse(data));
             //console.log(JSON.error_count);

             if(response.statusCode == 200  &&  JSON.parse(data).error_count == 0){   //&&  JSON.error_count == 0
                res.sendFile(__dirname + "/success.html")
            } else {
                res.sendFile(__dirname + "/failure.html")
            }

           // console.log(response.new_member)
        })
    })

    request1.write(jsonData);
    request1.end() ;
    

    

    //console.log(fName , lName , eMail);

    // res.send
})

app.post("/failure" , function(req , res){
    res.redirect("/");
})

app.listen(3000, function(){
    console.log("app is running on port 3000");
}
)

//api key
// 4f90a2ea3bbbf059a6e930bc4838f40c-us13

//audiance id 
// 33cdb8b5c2