const express=require("express");
const bodyParser=require("body-parser");
const app=express();
const request=require("request");
const https=require("https");

//Mentioning imp code to use body parser
app.use(bodyParser.urlencoded({extended:true}));

//The below statement is to declare the folder named "public " as static so that we can access local address of css files and images inside our html files
app.use(express.static("public"));

//app.get that would load the provided html file at the given address i.e the home page
app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
})


//app.post to route the http post requests to a certified path with specified callback function

app.post("/",function(req,res){


    //Accessing our data using the body parser npm

    const firstnaam=req.body.firstname;
    const lastnaam=req.body.lastname;
    const emayl=req.body.emaill;

    //creating data variable for the mailchimp.
    //data is an object
    var data={
        
        //Member consist of an array ,Inside the array we have multile key,value pairs as per mentioned in the documentary
        members:[
    
            {
                //There are the parameters that would be listed in the mailchimp when you go to see the stored input

                email_address:emayl,
                status:"subscribed",
                merge_fields:{
                    FNAME: firstnaam,
                    LNAME: lastnaam
                }
            }
        ]
    };

    //Stringifying the data as we need to pass our data in the form of stringified data
    //We'll send the stringified data to the mailchimp

    const jsonData=JSON.stringify(data);

    //REMEMBER! URL should be entered as a string.

    const url="https://us21.api.mailchimp.com/3.0/lists/64215a22b4";

    const options={
        //Method:post is used to post our data to external website basically.
        method:"POST",
        auth:"prince:ed410b7e4be6e1f82f95472332682c8e-us21"

    }

    //To post the request we have to store our http request in a variable
    //And later request.write it
    const request= https.request(url,options,function(response)
    {
        //the statuscode is for the http request i.e if the request is executed succesfully then its status code is 200 else smth else.
        //Thats the reason we wrote the below code inside this.

            if(response.statusCode==200){
                res.sendFile(__dirname+"/success.html");
            }else
            {
                res.sendFile(__dirname+"/failure.html");
            }


            response.on("data",function(d){
                //Whenever u send a data,U must parse it from the json format,As u can see below we can parse and see the data
                // console.log(JSON.parse(d));
            })
    })

    //After storing the https.request inside variable called request we'll write the data to mailchimp
    request.write(jsonData);
    request.end();


})

//After getting displayed with success or failure we'll get redirected to the home page as mentioned below
app.post("/success",function(req,res){
    //IMP Function!!!
    res.redirect("/");
})

app.post("/failure",function(req,res){
    
    res.redirect("/");
})

//process.env.PORT is for the heroku so that it can host on whatever Port it wants and also we can access it locally as we added 1000 using the or command
app.listen( process.env.PORT || 1000,function(){
    console.log("server running on port 1000")
})








//api
//ed410b7e4be6e1f82f95472332682c8e-us21

//list id
//64215a22b4

//url
//https://us21.api.mailchimp.com/3.0/lists/{list_id}