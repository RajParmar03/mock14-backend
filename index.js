const express = require("express");
const connection = require("./config/db");
const cors = require("cors");
const UserModel = require("./models/user.model");

// const url = "http://localhost:8080";


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).send("on the raj parmar mock 14 backend...");
});

app.post("/openaccount", async (req, res) => {
    const { name, gender, dob, email, mobile, address, initialBalance, adharNo, panNo } = req.body;
    try {
        let users = await UserModel.find({ email });
        let user;
        if (users.length > 0) {
            user = users[0];
            res.status(200).send({ msg: "Account already Created.", user: user });
        } else {
            let newUser = new UserModel(req.body);
            await newUser.save();
            let user = await UserModel.find({ email });
            res.status(200).send({ msg: "Account Successfully Created.", user: user });
        }
    } catch (error) {
        res.status(400).send({ msg: "Failed To Create Account." });
    }
});

app.patch("/updatekyc/:id", async (req, res) => {
    const id = req.params.id;
    const { name, dob, email, mobile, adharNo, panNo } = req.body;
    try {
        let user = await UserModel.findByIdAndUpdate({ _id: id } , {name,dob,email,mobile,adharNo,panNo});
        res.status(200).send({msg : "updated successfully..."});
    } catch (error) {
        res.status(400).send({ msg: "Failed To update the details..." });
    }
});

app.patch("/depositmoney/:id", async (req, res) => {
    console.log("in the deposite" , req.body);
    const id = req.params.id;
    console.log("this is id" , id);
    const { amount } = req.body;
    try {
        let user = await UserModel.findById({ _id: id });
        console.log("in the try" , user);
        let newAmount = +user.initialBalance + amount;
        console.log(newAmount);
        let newLedger = [...user.ledger , {deposite : amount}];
        console.log(newLedger);
        await UserModel.findByIdAndUpdate({ _id: id } , {initialBalance : newAmount, ledger : newLedger});
        res.status(200).send({msg : "deposited successfully..."});
    } catch (error) {
        res.status(400).send({ msg: "Failed To deposit the amound..." });
    }
});

app.patch("/withdrawmoney/:id", async (req, res) => {
    const id = req.params.id;
    const { amount } = req.body;
    try {
        let user = await UserModel.findById({ _id: id });
        if(user.initialBalance >= amount){
            let newAmount = +user.initialBalance - +amount;
            let newLedger = [...user.ledger , {withdraw : amount}];
            await UserModel.findByIdAndUpdate({ _id: id } , {initialBalance : newAmount, ledger : newLedger});
            res.status(200).send({msg : "withdraw successfully..."});
        }else{
            res.status(400).send({msg : "Insuffisient balance."});
        }
    } catch (error) {
        res.status(400).send({ msg: "Failed To deposit the amound..." });
    }
});

app.patch("/transfermoney/:id", async (req, res) => {
    const id = req.params.id;
    const {toName, email, PanNo , amount } = req.body;
    try {
        let sender = await UserModel.findById({ _id: id });
        if(sender.initialBalance >= amount){
            let recievers = await UserModel.find({email});
            if(recievers.length > 0){
                let reciever = recievers[0];
                let newAmount = +sender.initialBalance - +amount;
                let newReceiverAmount = +reciever.initialBalance + +amount;
                let senderLedger = [...sender.ledger , {sended : amount}];
                let recieverLedger = [...reciever.ledger , {received : amount}];
                await UserModel.findByIdAndUpdate({ _id: id } , {initialBalance : newAmount, ledger : senderLedger});
                await UserModel.findByIdAndUpdate({_id:reciever._id} , {initialBalance : newReceiverAmount, ledger : recieverLedger});
                res.status(200).send({msg : "trasferred amount successfully..."});
            }else{
                res.status(400).send({msg : "receiver not found...."});
            }
        }else{
            res.send(400).send({msg : "Insuffisient balance."});
        }
    } catch (error) {
        res.status(400).send({ msg: "Failed To transfer the amound..." });
    }
});

app.get("/printstatement/:id" , async(req , res) => {
    let id = req.params.id;
    try{
        let user = await UserModel.findById({_id : id});
        res.status(200).send({msg: "Success" , data : user.ledger});
    }catch(error){
        res.status(400).send({msg : "failed to get data for statement..."});
    }
});

app.get("/closeaccount/:id" , async(req , res) => {
    let id = req.params.id;
    try {
        await UserModel.findByIdAndDelete({_id : id});
        res.status(200).send({msg: "Successfully closed the account."});
    } catch (error) {
        res.status(400).send({msg : "failed close the account..."});
    }
})




app.listen(8080, async () => {
    try {
        await connection;
        console.log("successfully connected with DB...");
    } catch (error) {
        console.log("failed to connect with DB...");
    }
    console.log("server is successfully started at 8080...");
});




// {
//     "name" : "raj parmar",
//     "gender" : "male",
//     "dob" : "03/10/1997",
//     "email" : "rajparmar@gmail.com",
//     "mobile" : 9033920621,
//     "address" : "adajan,surat",
//     "initialBalance" : 2000,
//     "adharNo" : 21345678912341,
//     "panNo": "3221321MM11"
// }

// {
//     "name":"pratikparmar",
//     "gender":"male",
//     "dob":"28/08/1995",
//     "email":"pratikparmar@gmail.com",
//     "mobile":1234567890,
//     "address":"adajan,surat",
//     "initialBalance":2000,
//     "adharNo":545132135146,
//     "panNo":"6554PM1234"
// }


// 64310eb729cd25230d0db411