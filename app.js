const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();
var neoArray = [];
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  //res.sendFile(__dirname + "/index.html");
  res.render("index", { neoArray: neoArray });
});

app.post("/", async (req, res) => {
  const date1 = req.body.date1 + "T00:00:00";
  const date2 = req.body.date2 + "T23:59:59";
  console.log(date1, date2);
  const url =
    "https://ssd-api.jpl.nasa.gov/cad.api?neo=true&date-min=" +
    date1 +
    "&date-max=" +
    date2;
  console.log(url);

  try {
    await https.get(url, function (response) {
      console.log(response.statusCode);
      if (response.statusCode != 200) {
        res.send("Error!");
      } else {
        response.on("data", function (data) {
          const neoData = JSON.parse(data);
          neoArray = neoData.data;
          // console.log(neoArray);
          res.redirect("/");
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(process.env.PORT || 5000, function () {
  console.log("Server running on port 5000");
});
