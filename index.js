const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const uri = process.env.DB_PATH;
console.log(uri);
// const uri = "mongodb://localhost:27017";

let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const users = ["Asad", "Bashir", "Abdullah", "Mamun", "Zahid", "Tamim"];



// app.get('/', (req, res) => {
//     res.send('I know how to open node ...YAY');
// });

app.get('/products', (req, res) => {
    // client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        // Database Connection
        const collection = client.db("onlineStore").collection("products");
        collection.find({ name: 'admin' }).limit(3).toArray((err, documents) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err });
            }
            else {
                res.send(documents);
            }
        })
        // client.close();
    });
});

// app.get('/fruits/banana', (req, res) => {
//     res.send({ fruit: 'banana', quantity: 1000, price: 10000 });
// });

app.get('/users/:id', (req, res) => {
    console.log(req.params.id);
    console.log(req.query.sort);

    const id = req.params.id;
    const name = users[id];
    res.send({ id, name });
});

app.post('/addProduct', (req, res) => {
    // console.log('Data Received: ', req.body);

    // Save to Database
    const product = req.body;
    console.log(product);

    // client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        // Database Connection
        const collection = client.db("onlineStore").collection("products");
        collection.insertOne(product, (err, result) => {
            console.log(res);
            console.log(err);
            console.log("Successfully Inserted ...... ", result);
            if (err) {
                console.log(err);
                res.status(500).send({ message: err });
            }
            else {
                res.send(result.ops[0]);
                // res.send(result);
            }
        })
        console.log(err);
        console.log("Database Connected ...... ");
        // client.close();
    });
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening to port ${port}`));