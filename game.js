import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { code, action, data } = req.body || {};
  const qcode = req.query.code;

  try {
    if (req.method === 'GET') {
      const game = await redis.get(`game:${qcode}`);
      return res.json(game || null);
    }
    if (req.method === 'POST') {
      if (action === 'get') {
        const game = await redis.get(`game:${code}`);
        return res.json(game || null);
      }
      if (action === 'set') {
        await redis.set(`game:${code}`, data, { ex: 86400 });
        return res.json({ ok: true });
      }
    }
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }

  res.status(400).json({ error: 'Invalid request' });
}
