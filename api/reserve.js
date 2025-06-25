export const config = {
  api: {
    bodyParser: false,
  },
};

const fs = require("fs");
const path = require("path");
const FILE_PATH = path.resolve(__dirname, "../reservations.json");

module.exports = (req, res) => {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");
  let body = "";
  req.on("data", (chunk) => { body += chunk; });
  req.on("end", () => {
    try {
      // body 값이 실제로 잘 들어오는지 로그 찍기
      console.log("body:", body);
      if (!body) return res.status(400).send("빈 요청 본문");
      const parsed = JSON.parse(body);
      const nickname = parsed.nickname;
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
      console.error("파싱 오류:", err);
      res.status(400).send("잘못된 요청입니다.");
    }
  });
};
