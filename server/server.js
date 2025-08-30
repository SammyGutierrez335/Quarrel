const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const mongoURI = process.env.mongoURI;
const expressGraphQL = require("express-graphql");
require("./models/index");
// const User = require("./models/User");
// const Topic = require("./models/Topic");
// const Question = require("./models/Question");
// const Answer = require("./models/Answer");
// const techQuestions = require('./services/questions/techQuestions').default
// const {faker} = require('@faker-js/faker')
const schema = require("./schema/schema");
const cors = require("cors");
const uploadRoutes = require("./upload_route");
const path = require("path");


const app = express();

if (!mongoURI) throw new Error("This is a config keys.js error.");
mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        // seed()
        console.log("Connected to MongoDB successfully")}
    )
    .catch(err => console.log(err));

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
    app.get("/", (req, res) => res.sendFile(path.resolve(__dirname, "client", "build", "index.html")));
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

// const COLORS = [
//     "red",
//     "green",
//     "blue",
//     "black",
//     "orange",
//     "pink",
//     "brown"
// ]



// async function seed() {
//   try {
//     // find topics
//     const topics = await Topic.find({name: "Technology"});
//     // Create users
//     const users = await User.find({});

//     // Create questions
//     const questions = [];
//     for (let i = 0; i < 10; i++) {
//       const randomUser = users[Math.floor(Math.random() * users.length)];
//       const randomTopic = topics[Math.floor(Math.random() * topics.length)];

//       const question = new Question({
//         question: techQuestions.pop(),
//         date: faker.date.between({ from: '2020-01-01', to: '2020-03-30' }),
//         user: randomUser._id,
//         topics: ["68b339cb8f32c0ed28923306"],
//         answers: [],
//       });

//       await question.save();
//       questions.push(question);

//       // update topic with question reference if schema supports it
//       randomTopic.questions = randomTopic.questions || [];
//       randomTopic.questions.push(question._id);
//       await randomTopic.save();
//     }

    // Create answers: each user answers a random question NOT their own
    // for (let user of users) {
    //   const possibleQuestions = questions.filter(
    //     (q) => q.user.toString() !== user._id.toString()
    //   );
    //   if (possibleQuestions.length === 0) continue;

    //   const randomQuestion =
    //     possibleQuestions[Math.floor(Math.random() * possibleQuestions.length)];

      // const answer = new Answer({
      //   date: faker.date.between({ from: '2020-04-01', to: '2020-05-30' }),
      //   body: faker.lorem.paragraph(),
      //   user: user._id,
      //   question: randomQuestion._id,
      // });

    //   await answer.save();

    //   // update question with answer reference
    //   randomQuestion.answers.push(answer._id);
    //   await randomQuestion.save();
    // }

//     console.log("Database seeded successfully!");
//     process.exit(0);
//   } catch (err) {
//     console.error("Seeding error:", err);
//     process.exit(1);
//   }
// }

module.exports = app;