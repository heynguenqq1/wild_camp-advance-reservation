const fs = require("fs");
const path = require("path");
const FILE_PATH = path.resolve(__dirname, "../reservations.json");

module.exports = (req, res) => {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");
  let body = "";
  req.on("data", (chunk) => { body += chunk; });
  req.on("end", () => {
    try {
      // 1. body 내용 로그로 찍어서 실제 데이터 확인!
      console.log("body:", body);
      // 2. 빈 body이면 오류 응답
      if (!body) return res.status(400).send("빈 요청 본문");
      // 3. JSON 파싱
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
