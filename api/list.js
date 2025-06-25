const fs = require("fs");
const path = require("path");
const FILE_PATH = path.resolve(__dirname, "../reservations.json");

module.exports = (req, res) => {
  if (req.method !== "GET") return res.status(405).send("Method Not Allowed");
  let list = [];
  if (fs.existsSync(FILE_PATH)) {
    list = JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
  }
  res.status(200).json(list);
};
