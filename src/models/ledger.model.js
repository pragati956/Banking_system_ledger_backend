const mongoose = require("mongoose");
const ledgerSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: [true, "Ledger entry must be associated with an account"],
        index: true,
        immutable: true
    },
    amount: {
        type: Number,
        required: true
    }
    ,
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
        required: [true, "Ledger entry must be associated with a transaction"],
        index: true,
        immutable: true
    },
    type: {
        type: String,
        enum: {
            values: ["Credit", "Debit"],
            message: "Type must be either Credit or Debit"
        },
        required: [true, "Type is required for a ledger entry"],
        immutable: true
    }
})
function preventLegderModification() {
    throw new Error("Ledger entries cannot be modified once created");
}
ledgerSchema.pre('findOneAndUpdate', preventLegderModification);
ledgerSchema.pre('updateOne', preventLegderModification);
ledgerSchema.pre('updateMany', preventLegderModification);
ledgerSchema.pre('deleteOne', preventLegderModification);
ledgerSchema.pre('deleteMany', preventLegderModification);
ledgerSchema.pre('findOneAndDelete', preventLegderModification);
ledgerSchema.pre('findOneAndRemove', preventLegderModification);
ledgerSchema.pre('findOneAndReplace', preventLegderModification);
ledgerSchema.pre('remove', preventLegderModification);
const ledgerModel = mongoose.model('Ledger', ledgerSchema);
module.exports = ledgerModel;



