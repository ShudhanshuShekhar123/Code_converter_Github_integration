const express = require('express');
require("dotenv").config()
const axios = require("axios")
// var request = require('request')
const cors = require("cors");
const cookieParser = require('cookie-parser');


const app = express();

app.use(cors());
app.use(cookieParser());

app.use(express.json())

app.get("/auth", (req, res) => {
  const clientId = process.env.CLIENT_ID;
  const scopes = "repo"; // Specify the desired scope(s) here, separated by spaces

  // Redirect the user to the GitHub OAuth authorization URL with scopes
  res.redirect(`https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=http://localhost:3000/app&scope=repo`);
});

let accesstoken=""



// app.get("/gettoken", async   (req, res) => {
//   // const code = req.query.code;
//   // console.log(code, "code is here")
//  let response = await   axios.post(
//     'https://github.com/login/oauth/access_token',
//     null,
//     {
//       params: {
//         client_id: process.env.CLIENT_ID,
//         client_secret: process.env.CLIENT_SECRET,
//         code:req.query.code,
//       },
//       headers: {
//         Accept: 'application/json', // Request JSON response
//       },
//     }
//   )
  

//   access_token = response.data.access_token;
//   res.cookie('token1', access_token)
//   res.send( {access_token})


// })





app.get("/gettoken", async (req, res) => {
  try {
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      null,
      {
        params: {
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          code: req.query.code,
          
        },
        headers: {
          Accept: 'application/json', // Request JSON response
        },
      }
    );

  accesstoken = response.data.access_token;


   
    // // res.redirect("/setcookie");
    // res.cookie('token1', accesstoken, {
    //   // httpOnly: true, // Mark the cookie as HTTP-only for security
    // });
  
    res.send({accesstoken});
  } catch (error) {
    console.error('Error exchanging code for access token:', error);
    res.status(500).send('Internal Server Error');
  }
});



console.log('hello below')

// app.get("/setcookie",   (req,res)=>{

//   res.cookie('token1', accesstoken)
// console.log(accesstoken, "acestoken")

// res.cookie('token1', accesstoken)

// res.send(req.cookies)
// // return;

// })


  app.get("/profile", (req, res)=>{

   console.log(req.query.token, "accestoken in profile")
  

    axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${req.query.token}`,
      },
    })
    .then(response => {
      const userProfile = response.data;
      console.log(response, "usxerprofile");
      res.send(userProfile)

    })
    .catch(error => {
      console.error('Error fetching user profile:', error);
    });

  })

 
  



app.listen(8000, () => {
    console.log("Listening at PORT 8000")
})
