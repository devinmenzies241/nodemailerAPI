//Modules required 
const express = require('express'); 
const nodemailer = require("nodemailer");
const app = express();
const cors = require('cors'); 
require("dotenv").config();

//middleware
app.use(express.json());
app.use(cors()); 

//Setup nodemailer transport object
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL,
    pass: process.env.WORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
 });

 //Verify that the transporter has not received any errors
 transporter.verify((err, success) => {
  err
    ? console.log(err)
    : console.log(`=== Server is ready to take messages: ${success} ===`);
 });

 //Setup post route to handle sending the email via nodemailer
 app.post('/send', function (req, res) {
  //Setup what information will be sent
  let mailOptions = {
    from: `${req.body.mailerState.email}`,
    to: process.env.EMAIL,
    subject: `Important! New Message received from Portolio Form!`,
    html: `<h1 style='margin-bottom:0;'>From: ${req.body.mailerState.name}</h1>
           <br/>
           <h2 style='margin-top:0;'>Email: ${req.body.mailerState.email}</h2>
           <p>Message: ${req.body.mailerState.message}</p>`,
  };

  //Use transporter to send the mail with the specified options, console.log upon success or errors
  transporter.sendMail(mailOptions, function (err, data) {
  if (err) {
    res.json({
      status: 'fail',
    });
  } else {
    console.log("== Message Sent ==");
    res.json({
      status: 'success',
    });
  }
  });
});

//Declare port and tell express to start up server 
const port = process.env.PORT || 3001;

app.listen(port, () => {
 console.log(`Server is running on port: ${port}`);
});