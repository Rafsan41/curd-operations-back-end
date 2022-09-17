const express = require('express');
const {
    MongoClient,
    ServerApiVersion
} = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = 5000;

//use middleware
app.use(cors());

app.use(express.json());


const uri = "mongodb+srv://mongodbUser1:cXzsH0PsOnHdMUPm@cluster0.js8fvq9.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
});
//1st
// client.connect(err => {
//     const collection = client.db("foodMaster").collection("user");
//     // perform actions on the collection object
//     console.log('hitting the database');
//     const user = {
//         name: 'kito',
//         email: 'kitoTheCat123@gamil.com',
//         phone: '01608231298'
//     };
//     collection.insertOne(user)
//         .then(() => {
//             console.log('insert success')
//         })
//     // client.close();
// });
//2nd
async function run() {
    try {
        await client.connect
        const userCollection = client.db('foodvandar').collection("users");
        //get api
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        })
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: ObjectId(id) };
            const user = await userCollection.findOne(quary);
            console.log('load user with id', id);
            res.send(user);
        })


        //post api
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser) 
            console.log('got new user', req.body);
            console.log('added user', result);
            res.json(result);
            
        })
        //update api
        app.put('/users/:id', async(req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
      $set: {
                    name: updatedUser.name,
          email:updatedUser.email
      },
            };
            const result = await userCollection.updateOne(filter,updateDoc, options)
            console.log('updating users', req);
            res.json(result);
        })

        //DELET API
        app.delete('/users/:id', async(req,res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query)
            console.log('deleting user with id ',result);
            res.json(result);

        })
    } finally {
        //await client.close();
    }

}

run().catch(console.dir)



app.get('/', (req, res) => {
    res.send('testing backend runing ok')
});


app.listen(port, () => {
    console.log(port, 'backend chalu hoiche beda, eto tenson nis na')
})