const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const mongoURI = process.env.mongoURI;
const expressGraphQL = require("express-graphql");
const models = require("./models/index");
const schema = require("./schema/schema");
const cors = require("cors");
const uploadRoutes = require("./upload_route");
const path = require("path");

const app = express();

if (!mongoURI) throw new Error("This is a config keys.js error.");
mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB successfully"))
    .catch(err => console.log(err));

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
    app.get("/", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}


app.use(bodyParser.json());
app.use(cors());
app.use("/api/", uploadRoutes);

app.use(
    "/graphql",
    expressGraphQL( req => {
        return {
            schema,
            context: {
                token: req.headers.authorization
            },
            graphiql: true
        };
    })
);

module.exports = app;