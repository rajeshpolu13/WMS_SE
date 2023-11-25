const router = require('express').Router();
const transactionModel = require('../model/transactionModel');
const userModel = require('../utilities/connection');

const {
    v4: uuidv4,
 } = require('uuid');


 router.post("/addtotransaction", async (req, res,next) => {
    try {
       let reqObj = req.body;
       reqObj.transactionDate = new Date();
       reqObj.transactionId = uuidv4();
       reqObj.transactionStatus = "Pending";

      
       let isAdded = await transactionModel.createTransaction(reqObj);
       let userMode= await userModel.getRegistrationCollection();
      //  let userEmail = await userMode.find({id:isAdded.userId},{email:1})

       res.json({ "message": "Transaction is successfull" });
       
    }
    catch (e) {
       res.statusCode = e.status || 401;
       res.json({ "message": e.message });
    }
 });
 
 router.post("/updateTransaction", async (req, res,next) => {
   try {
      let reqObj = req.body.transaction;
      // console.log(reqObj);
      let isAdded = await transactionModel.updateTransaction(reqObj);
     //  let userEmail = await userMode.find({id:isAdded.userId},{email:1})

      res.json({ "message": "Transaction is successfull" });
      
   }
   catch (e) {
      res.statusCode = e.status || 401;
      res.json({ "message": e.message });
   }
});
 router.post("/gettransactions",async (req, res)=>{
   try{
      let reqBody={};
      if(req.body.userId)
         reqBody.userId = req.body.userId;
      if(req.body.status)
         reqBody.transactionStatus = req.body.status;
      let gettransactions = await transactionModel.findtransactions(reqBody);

      if (gettransactions && gettransactions.length > 0) {
         console.log('gettransaction successful');
         res.json(gettransactions);
      } else {
         console.log('No transactions found');
         res.json({ message: 'No transactions found' });
      }
   }
   catch(e){
       console.log("gettransaction Failed");
       res.statusCode=e.status;
       res.json({"message":e.message});
   }
});
 

module.exports = router;