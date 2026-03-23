const mongoose = require('mongoose');
const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, "Account must be associated with aa  user"],
        index: true
    },
    status: {
        type: String,
        enum: ["Active", "Inactive", "Closed"],
        message: "Status must be either Active, Inactive or Closed",
        default: "Active"
    },
    currency: {
        type: String,
        required: [true, "Currency is required for an account"],
        default: "INR"
    }
}, {
    timestamps: true
    // ,accountNumber: {
    //     type: String,
    //     unique: true,
    //     required: true
    // },

});
accountSchema.index({ user: 1, status: 1 })
const accountModel = mongoose.model('Account', accountSchema);
module.exports = accountModel;