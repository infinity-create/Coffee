'use strict';

const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const mysql = require("mysql");
// const { Console } = require("console");

const PORT ="8080";
const HOST = "0.0.0.0";
const app = express();

const cors = require('cors');
app.use(cors());    

app.use(bodyParser.urlencoded({ extended: true}));

var con = mysql.createConnection({
    host: 'mysql1',
    user: 'root',
    database: 'CoffeeShop',
    password: 'admin'
})

const PATH = __dirname;

app.get('/', (req, res) => {
    res.sendFile(PATH + '/LandingPage.html');
})

app.get('/customerStart', (req, res) => {
    res.sendFile(PATH + '/Customers.html');
})

app.get('/management', (req, res) => {
    res.sendFile(PATH + '/Employees.html');
})

app.get('/MenuPage', (req, res) => {
    res.sendFile(PATH + '/ModifyMenu.html');
})

app.post('/submit', (req, res) => {
    var orderInfo = req.body.info;

    var msql = 'INSERT INTO Customer_Orders (notes) VALUES("' + orderInfo + '")';
    con.query(msql, function (err, result) {
        if (err) throw err;
        console.log("Created");
        console.log(result.insertId)
        res.send(String(result.insertId));
    });

    // var msql = 'SELECT * FROM Customer_Orders WHERE number="' + recordID + '"';
    // con.query(msql, function (err, result) {
    //     if (err) throw err;
    //     console.log("Selected");
    //     res.json(result);
    // });

})

app.post('/orderStatus', (req, res) => {
    var recordID= req.body.statusID;

    // var msql = 'INSERT INTO Customer_Orders (notes) VALUES()';
    // con.query(msql, function (err, result) {
    //     if (err) throw err;
    //     console.log("Created");
    //     var recordID= result.insertID;
    // });

    var msql = 'SELECT * FROM Customer_Orders WHERE number="' + recordID + '"';
    con.query(msql, function (err, result) {
        if (err) throw err;
        // console.log("Selected");
        res.json(result);
    });

})

// 'UPDATE tutorials_tbl
//       SET tutorial_title="Learning JAVA"
//       WHERE tutorial_id=3'
app.post('/makeOrderComplete', (req, res) =>{
    var orderNumber = req.body.number;

    var msql = 'UPDATE Customer_Orders SET status="1" WHERE number="' + orderNumber + '"';
    con.query(msql, function (err, result) {
        if (err) throw err;
        console.log("updated Order");
        res.json(result);
    });
})

app.get('/createOrder', (req, res) => {
    var msql = "CREATE TABLE Customer_Orders (number INT AUTO_INCREMENT PRIMARY KEY, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, notes VARCHAR(200) NOT NULL, status BOOLEAN NOT NULL DEFAULT FALSE)";
    con.query(msql, function (err, result) {
        if (err) throw err;
        console.log("Created");
    });
});

app.get('/createMenu', (req, res) => {
    var msql = "CREATE TABLE Menu (itemID VARCHAR(4) NOT NULL PRIMARY KEY,item VARCHAR(100) NOT NULL, size ENUM('small', 'medium', 'large', ''), price FLOAT NOT NULL)";
    con.query(msql, function (err, result) {
        if (err) throw err;
        console.log("Created");
    });
});

app.get('/customer', (req, res) => {
    var msql = "SELECT * FROM Menu";
    con.query(msql, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

app.get('/employee', (req, res) => {
    var msql = "SELECT * FROM Customer_Orders WHERE status='0'";
    con.query(msql, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});


app.post('/makeAddition', (req, res) => {
    var ID = req.body.itemID;
    var name = req.body.item;
    var size = req.body.size;
    var price = req.body.price;

    var msql = 'INSERT INTO Menu (itemID, item, size, price) VALUES("'+ ID +'", "' + name + '", "'+ size+'", "' +price+'")';
    con.query(msql, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
})

app.post('/makeModification', (req, res) => {
    var ID = req.body.itemID;
    var name = req.body.item;
    var size = req.body.size;
    var price = req.body.price;

    var msql = 'UPDATE Menu SET item="' + name + '", size="' + size + '", price="'+ price + '" WHERE itemID="' + ID + '"';
    con.query(msql, function (err, result) {
        if (err) throw err; 
        console.log("updated Order");
        res.json(result);
    });
})

app.post('/makeDeletion', (req, res) => {
    var ID = req.body.itemID;
    var msql = 'DELETE FROM Menu WHERE itemID="' + ID + '"';
    con.query(msql, function (err, result){
        if (err) throw err;
        console.log("deleted"); 
        res.json(result);
    });
})

app.post('/cancelOrder', (req, res) => {
    var ordernumber = req.body.number;
    var msql = 'DELETE FROM Customer_Orders WHERE number="' + ordernumber + '"';
    con.query(msql, function (err, result){
        if (err) throw err;
        console.log("deleted"); 
        res.json(result);
    });
})

app.get('/select', (req, res) => {
    var sql = 'DESC Customer_Orders';
    con.query(sql, function (err, result) {
      if (err) throw err;
      res.json(result);  
      });
});

app.get('/modify', (req, res) => {

    // ALTER TABLE Menu MODIFY itemID VARCHAR(4) NOT NULL PRIMARY KEY
    var sql = 'ALTER TABLE Menu MODIFY size ENUM("small", "medium", "large", "")';
    con.query(sql, function (err, result){
        if (err) throw err;
        console.log("altered"); 
    });
})

app.get('/insert', (req,res) => {
    var sql = 'INSERT INTO Menu (itemID, item, size, price) VALUES("004", "Donut", "", "30.00")';
    con.query(sql, function (err, result){
        if (err) throw err;
        console.log("inserted"); 
    });
})

app.get('/delete', (req, res) =>{
    var sql = 'DELETE FROM Menu WHERE itemID="004"';
    con.query(sql, function (err, result){
        if (err) throw err;
        console.log("inserted"); 
    });
})

app.use('/', express.static('Project'));


app.listen(PORT, HOST);


console.log("up and running");
