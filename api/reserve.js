const fs = require("fs");
const path = require("path");
const FILE_PATH = path.resolve(__dirname, "../reservations.json");

module.exports = (req, res) => {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");
  let body = "";
  req.on("data", (chunk) => { body += chunk; });
  req.on("end", () => {
    try {
      const { nickname } = JSON.parse(body);
      if (!nickname) return res.status(400).send("닉네임 필요");

      let list = [];
      if (fs.existsSync(FILE_PATH)) {
        list = JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
      }

      if (list.includes(nickname)) {
        return res.status(409).send("이미 등록된 닉네임입니다.");
      }

      list.push(nickname);
      fs.writeFileSync(FILE_PATH, JSON.stringify(list, null, 2));
      res.status(200).send("성공");
    } catch (err) {
      res.status(400).send("잘못된 요청입니다.");
    }
  });
};
