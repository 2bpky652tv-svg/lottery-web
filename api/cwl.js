// Vercel Serverless Function：转发中国福彩官方接口，解决浏览器跨域(CORS)。
// 前端调用：/api/cwl?name=ssq&issueCount=60
export default async function handler(req, res) {
  const name = req.query.name || "ssq";
  const issueCount = req.query.issueCount || "60";
  const target =
    "https://www.cwl.gov.cn/cwl_admin/front/cwlkj/search/kjxx/findDrawNotice" +
    `?name=${encodeURIComponent(name)}&issueCount=${encodeURIComponent(issueCount)}`;

  try {
    const r = await fetch(target, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Referer": "https://www.cwl.gov.cn/",
        "Accept": "application/json, text/plain, */*",
      },
    });
    const data = await r.json();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json(data);
  } catch (e) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(502).json({ error: "upstream fetch failed: " + String(e) });
  }
}
