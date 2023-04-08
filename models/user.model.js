const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name : String,
    gender : String,
    dob : Date,
    email : String,
    mobile : Number,
    address : String,
    initialBalance : Number,
    adharNo : Number,
    panNo : String,
    ledger : Array
});

const UserModel = mongoose.model("user" , userSchema);

module.exports = UserModel;