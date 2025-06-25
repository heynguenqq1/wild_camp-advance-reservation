const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
  if (req.method !== "GET") return res.status(405).send("Method Not Allowed");

  try {
    const { data, error } = await supabase
      .from("reservations")
      .select("nickname")
      .order("id", { ascending: true });

    if (error) throw error;

    // 닉네임만 배열로 반환
    res.status(200).json(data.map((r) => r.nickname));
  } catch (err) {
    res.status(400).send("목록 조회 실패");
  }
};
