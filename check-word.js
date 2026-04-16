export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { word } = req.body;
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 10,
        messages: [{ role: "user", content: `Ist "${word}" ein gültiges deutsches Wort? Nur JA oder NEIN.` }]
      })
    });
    const d = await r.json();
    const valid = d.content?.[0]?.text?.trim().toUpperCase().startsWith("JA");
    res.json({ valid });
  } catch {
    res.json({ valid: true });
  }
}
