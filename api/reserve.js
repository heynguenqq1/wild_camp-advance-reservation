const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  let body = "";
  await new Promise((resolve) => {
    req.on("data", (chunk) => { body += chunk; });
    req.on("end", resolve);
  });

  try {
    const { nickname } = JSON.parse(body);
    if (!nickname) return res.status(400).send("닉네임 필요");

    // 닉네임 중복 체크
    const { data: existing, error: selectError } = await supabase
      .from("reservations")
      .select("id")
      .eq("nickname", nickname);

    if (selectError) throw selectError;
    if (existing && existing.length > 0) {
      return res.status(409).send("이미 등록된 닉네임입니다.");
    }

    // 닉네임 저장
    const { error: insertError } = await supabase
      .from("reservations")
      .insert({ nickname });

    if (insertError) throw insertError;

    res.status(200).send("성공");
  } catch (err) {
    console.error("API 500 error:", err); // 이 라인 추가
    res.status(500).send("서버 오류: " + (err.message || err));
  }
};
