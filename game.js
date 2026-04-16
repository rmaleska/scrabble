// Vercel KV - kostenloses Storage direkt in Vercel
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { code, action, data } = req.body || {};
  const qcode = req.query.code;

  if (req.method === 'GET') {
    const game = await kv.get(`game:${qcode}`);
    return res.json(game || null);
  }

  if (req.method === 'POST') {
    if (action === 'set') {
      await kv.set(`game:${code}`, data, { ex: 86400 }); // 24h TTL
      return res.json({ ok: true });
    }
    if (action === 'get') {
      const game = await kv.get(`game:${code}`);
      return res.json(game || null);
    }
  }

  res.status(400).json({ error: 'Invalid request' });
}
