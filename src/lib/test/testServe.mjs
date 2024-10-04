// import http from "http";
import express from "express";
import cors from "cors";

const __dirname = import.meta.dirname;

const app = express();

const httpPort = 1234;
const version = "0.5.0";

app.use(cors());



app.listen(httpPort, () => {
  console.log("App Listening for http on port ", httpPort);
});

app.get("/", async (req, res) => {
  console.log("-------------------------------------------------------------------");
  // console.log(JSON.stringify(req.headers));
  const jsonObj = req.headers;
  for (const x in jsonObj) {
    console.log(`${x} : ${jsonObj[x]}`)
  }
  res.set('MyHeader', 'hello/header');
  res.send('test');
});
