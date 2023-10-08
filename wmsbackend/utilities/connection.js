const { Schema } = require('mongoose');
const mongoose = require('mongoose');


const url = "mongodb+srv://npolu:Rajesh456@cluster0.0uz9di1.mongodb.net/";


const RegistrationSchema = Schema(
    {
    id: { type: String, unique: true, required: [true, "userId is mandatory"] },
    i_d: { type: String, required: [true, "i_d is mandatory"] },
    fname: { type: String, required: [true, "first name is mandatory"] },
    lname: { type: String, required: [true, "last name is mandatory"] },
    dob: { type: String, required: [true, "Date of birth is mandatory"] },
    email: { type: String, unique: true, required: [true, "name is mandatory"] },
    phone: { type: Number, required: [true, "Mobile number is mandatory"] },
    username: { type: String, unique: true, required: [true, "userid is mandatory"] },
    password: { type: String, required: [true, "Mobile number is mandatory"] },
    address: { type: String, required: [true, "Address is mandatory"] },
    zip: { type: Number, required: [true, "Mobile number is mandatory"] },
    city: { type: String, required: [true, "city name is mandatory"] },
    state: { type: String, required: [true, "state name is mandatory"] },
    role:{type:String,default:"Customer"},
    customername: { type: String },
    customertype: { type: String },
    dueamount: { type: String }
    }, { collection: "Users" }
)

let connection = {};

//database connection to register user details
connection.getRegistrationCollection = async () => {
    try {

        let dbConnection = await mongoose.connect(url, { dbName: 'WMS',useNewUrlParser: true, useUnifiedTopology: true })
        let model = await dbConnection.model('Users', RegistrationSchema)
        return model;
    }
    catch (e) {
        let err = new Error("could not connect to database");
        err.status = 500;
        throw err;
    }
}

module.exports = connection;