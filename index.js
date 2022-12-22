require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
// const cors = require("cors");
const port = process.env.PORT || 5000;

const cors = require("cors");
// const { ObjectID } = require("bson");


app.use(cors({origin: "http://localhost:3000"}));


app.use(express.json());

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q66zrl2.mongodb.net/?retryWrites=true&w=majority`;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hesh6qa.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const db = client.db("blogs");
    const productCollection = db.collection("blog");

    app.get("/products", async (req, res) => {
      const cursor = productCollection.find({});
      const product = await cursor.toArray();

      res.send({ status: true, data: product });
    });

    app.post("/product", async (req, res) => {
      const product = req.body;

      const result = await productCollection.insertOne(product);

      res.send(result);
    });
    app.patch("/product/:id", async (req, res) => {
      const id = req.params.id;
      console.log("id",id)
      const product = req.body;
      console.log("updated Product", product);
      // const filter = {_id : ObjectID(id)}
      // const filter = {_id : id}
      const result = await productCollection.updateOne({_id: ObjectId(id)},{$set: {title: req.body.title}});
        // console.log(object);
      // res.send(req.body);
      console.log("result", result);
      res.send(result);
    });

    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;

      const result = await productCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
