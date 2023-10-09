const loginModelConnection = require('../utilities/connection');
const hbs = require('nodemailer-express-handlebars')
const nodemailer = require('nodemailer')
const path = require('path')
// const viewpath= require('../views/')

let loginOperations = {};

loginOperations.validateLogin = async (data) => {
    try {
        
        // console.log(data);
        let loginModel = await loginModelConnection.getRegistrationCollection();
        let loginvalid = await loginModel.find({
            "username" : data.username ,
            "password": data.password
        });
        // console.log(loginvalid);
        if (loginvalid.length === 1) {
            return loginvalid;
        }
        else {
            let err = new Error("failed to login");
            err.status = 404;
            throw err;
        }
    }
    catch (e) {
        console.log(e);
        throw e;
    }

}

// initialize nodemailer
var transporter = nodemailer.createTransport(
    {
        service: 'outlook',
        auth:{
            user: 'do-not-reply-snackclub@outlook.com',
            pass: '475#25@albany'
        }
    }
);

// point to the template folder
const handlebarOptions = {
    viewEngine: {
        partialsDir: path.resolve('../Restaurant-MS/views'),
        defaultLayout: false,
    },
    viewPath: path.resolve('../Restaurant-MS/views'),
};

// use a template file with nodemailer
transporter.use('compile', hbs(handlebarOptions))

loginOperations.findpassword = async (email) => {
    try {
        // console.log(email);
        let loginModel = await loginModelConnection.getRegistrationCollection();
        let validmail = await loginModel.find({email:email},{password:1,fname:1});
        // console.log(validmail);
        if (validmail.length === 1) {

            var mailOptions = {
                from: '"Snack-club" <do-not-reply-snackclub@outlook.com>', // sender address
                to: email, // list of receivers
                subject: 'Forgot password',
                template: 'email', // the name of the template file i.e email.handlebars
                context:{
                    name: validmail[0].fname, // replace {{name}} with Adebola
                    password: validmail[0].password // replace {{company}} with My Company
                }
            };

            // trigger the sending of the E-mail

            console.log(handlebarOptions);
            transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
            });
            return true;
        }
        else {
            let err = new Error("failed to send password");
            err.status = 404;
            throw err;
        }
    }
    catch (e) {
        console.log(e);
        throw e;
    }
}

module.exports=loginOperations;