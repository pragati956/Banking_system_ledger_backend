const tranactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const emailService = require("../services/email.service");
const mongoose = require("mongoose");

//create a new transaction
//10 step transfer flow:
//validate request body
//validate source and destination accounts
//validate sufficient balance in source account
//derive sender balance from ledger
//create transaction
//create debit ledger entry for sender
//create credit ledger entry for receiver
//update account balances
//commit mongodb session
//send email notification to both parties

//validate request
async function createTransaction(req, res) {
    const {
        fromAccount,
        toAccount,
        amount,
        idempotencyKey
    } = req.body;
    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "FromAccount,toAccount,amount and  idempotent are required"

        })
    }
    const fromUserAccount = await accountModel.findOne({ _id: fromAccount });
    const toUserAccount = await accountModel.findOne({ _id: toAccount });

    if (!fromUserAccount || !toUserAccount) {
        return res.status(404).json({
            message: "Source or destination account not found"
        });
    }

    // ✅ idempotency check
    const isTransactionAlreadyExists = await tranactionModel.findOne({ idempotencyKey });

    if (isTransactionAlreadyExists) {
        return res.status(200).json({
            message: "Transaction already exists",
            transaction: isTransactionAlreadyExists
        });
    }
    if (isTransactionAlreadyExists.status === "PENDING") {

        return res.status(200).json({
            message: "Transaction is still processing"
        })
    }
    if (isTransactionAlreadyExists === "FAILED") {
        return res.status(500).json({
            message: "Previous trasaction attempt failed,please try again"
        })
    }
    if (isTransactionAlreadyExists === "REVERSED") {
        return res.status(500).json({
            message: " trasaction reversed please try again"
        })
    }

    //check account status
    if (fromUserAccount.status != "ACTIVE" || toUserAccount.status != "ACTIVE") {
        return res.status(400).json({
            message: "Both fromAccount and toAccoount must be active to process transaction"
        })
    }
    //derive sender balance from ledger
    const balance = await fromUserAccount.getBalance();
    if (balance < amount) {
        return res.status(400).json({
            message: `Insufficient balance in source account.Current balance is ${balance}`
        })
    }
    //create transaction
    const session = await mongooose.startSession();
    session.startTransaction();
    const trasaction = await transactionModel.create([{
        fromAccount,
        toAccount,
        amount, idempotencyKey,
        status: "PENDING"
    }], { session })
    const debitLedgerEntry = await ledgerModel.create([{
        account: fromAccount,
        amount: amount,
        transaction: transaction._id,
        type: "Debit"
    }], { session });
    const creditLedgerEntry = await ledgerModel.create([{
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "Credit"
    }], { session })
    trasaction.status = "COMPLETED";
    await trasaction.save({ session })
    await session.commitTransaction();
    session.endSession();
    //send email notification to both parties
    await emailService.sendTransactionEmail(req.user.email, req.user.name, amount, toUserAccount.user);
    return res.status(201).json({
        message: "Transaction successful",
        transaction: trasaction
    })
}

module.exports = { createTransaction }; // ✅ export