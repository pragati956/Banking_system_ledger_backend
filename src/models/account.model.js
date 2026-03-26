const mongoose = require('mongoose');
const ledgerModel=require("./ledger.model")
const accountSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, "Account must be associated with aa  user"],
        index: true
    },
    status:{
        type: String,
        enum: ["Active", "Frozen", "Closed"],
        message: "Status must be either Active, Inactive or Closed",
        default: "Active"
    },
    currency:{
        type: String,
        required: [true, "Currency is required for an account"],
        default: "INR"
    }
},{
    timestamps: true
    // ,accountNumber: {
    //     type: String,
    //     unique: true,
    //     required: true
    // },
});
accountSchema.index({ user: 1, status: 1 })
accountSchema.methods.getBalance= async function(){
    const balanceData=await ledgerModel.aggregate([
        { $match: { account: this._id } },
        {
            $group: {
                _id: null,
                totalDebits: {
                    $sum: {
                        $cond: [{ $eq: ["$type", "Debit"] }, "$amount", 0]
                    }
                },
                totalCredits: {
                    $sum: {
                        $cond: [{ $eq: ["$type", "Credit"] }, "$amount", 0]
                    }
                }
            },$project: {
                _id: 0,
                balance:{$substract:["$totalCredits","$totalDebits"]}
            }
        }
    ]);

  if(balanceData.length===0){
    return 0
};
return balanceData[0].balance;
}



const accountModel = mongoose.model('Account', accountSchema);
module.exports = accountModel;
