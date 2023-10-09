const router = require('express').Router();
const loginModel = require('../model/loginModel');
const jwt = require('jsonwebtoken');
const authVerify= require('../utilities/authenticator');
const CryptoJS = require('crypto-js');
const TOKEN_SECRET="SEWMSPROJECT";

const generateAuthToken=(username)=>{
return jwt.sign(username,TOKEN_SECRET,{expiresIn:'7200s'});
}


router.post("/validate", async (req, res, next) => {
    try {

        const passphrase = '123';
        // console.log('data before encrypt');
        const pass=req.body.password;
        const bytes = CryptoJS.AES.decrypt(pass, passphrase);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        // console.log("decrypted data");
        // console.log(originalText);
        // console.log("decrypt end");

        let logins = {
            username:req.body.username,
            password:originalText
        };
        
        let loginvalidation = await loginModel.validateLogin(logins);
        // console.log(loginvalidation);
        if (loginvalidation) {
        console.log("GET /login success");
        let details={ userId:loginvalidation[0].id ,username:loginvalidation[0].username,
                        firstName: loginvalidation[0].fname,role:loginvalidation[0].role};
        const jwttoken=await generateAuthToken(details);
            
        res.json({token:jwttoken,details});
        }
        
    }
    catch (e) {
        console.log("GET /login Failed");
        res.statusCode=e.status||500;
        res.json({"message":e.message});
    }
});

router.post("/verify",authVerify.authenticateToken,async(req,res,next)=>{

    console.log(req.body);
    res.json(req.body);

})

router.post("/forgotpassword", async (req, res, next) => {
    try {   
        let findmail = await loginModel.findpassword(req.body.email);
        if (findmail) {
        console.log("GET password success");
        res.json(findmail);
        }
        
    }
    catch (e) {
        console.log("GET /password Failed");
        res.statusCode=e.status||500;
        res.json({"message":e.message});
    }
});

module.exports = router;