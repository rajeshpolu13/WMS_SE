const { ElasticBeanstalk } = require('aws-sdk');
const dBconnection = require('../utilities/connection');
const {
    v4: uuidv4,
} = require('uuid');

let transactionOperations = {};

transactionOperations.createTransaction = async (transaction) => {
    // first update the inventory items by category
    // update the cart table (delete all cart items)
    //send data to purchases model
    //update the transaction status to complete
    try {
            let transactionModel = await dBconnection.getTransactionCollection();
            let cartModel = await dBconnection.getCartCollection();
            //let purchasesModel = await dBconnection.getPurchasesCollection();
            // let invntryModel = await dBconnection.getInventoryCollection();

            for (let trs of transaction.transactionItems) {
                // let updateInvtry = await invntryModel.updateMany({ category: trs.itemCategory }, { $inc: { quantity: -1 } }); //update itemqtity
                // console.log(updateInvtry, "invtry");
                // let obj = {
                //     purchaseId: uuidv4(),
                //     userId: transaction.userId,
                //     itemId: trs.itemId,
                //     itemName: trs.itemName,
                //     purchaseDate: transaction.transactionDate,
                //     deliveredDate: transaction.transactionDate,
                //     totalCost: trs.totalPrice,
                //     paymentType: transaction.transactionType,
                //     itemImage: trs.itemImage,
                //     itemsQntity: trs.itemQuantity
                // }
                // let updatePurchases = await purchasesModel.create(obj);
                let makeCartInactive = await cartModel.updateOne({ cartId: trs.cartId }, { $set: { itemActive: 0 } })
            }

            transaction.transactionStatus = "ordered";

            // console.log(transaction, "--after SUCCESS");
            let finalTransction = await transactionModel.create(transaction);
       
            return finalTransction;
        
    }
    catch (e) {
        // console.log(e);
        throw e;
    }

}

transactionOperations.updateTransaction = async (transaction) => {
    try {
            let transactionModel = await dBconnection.getTransactionCollection();
            let invntryModel = await dBconnection.getInventoryCollection();

            for (let trs of transaction.transactionItems) {
                let updateInvtry = await invntryModel.updateOne({ itemId: trs.itemId }, { $inc: { quantity: -trs.itemQuantity } }); //update itemqtity
  
              
            }

            const filter = { "_id": transaction._id };
            const updateDocument = { $set: transaction };
            const result = await transactionModel.updateOne(filter, updateDocument);
            
        
    }
    catch (e) {
        // console.log(e);
        throw e;
    }

}

transactionOperations.findtransactions = async (reqBody) => {
    try {
        let transactions = await dBconnection.getTransactionCollection();
        let  transactiondata = await transactions.find(reqBody);
        
        if (transactiondata.length > 0) {
            return transactiondata;
        } else {
            let err = new Error("Failed to get transactions");
            err.status = 404;
            throw err;
        }
    }
    catch (e) {
        console.log(e);
        throw e;
    }
}


module.exports = transactionOperations;