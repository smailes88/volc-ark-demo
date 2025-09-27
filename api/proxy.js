
// 转发火山 Ark 文生图接口
export default async function handler(req, res) {
  // 允许前端跨域调用（Vercel 会自动加 Access-Control-Allow-Origin: *）
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end(); // 预检请求

  const { model, prompt, size, watermark } = req.body;
  const token = req.headers.authorization; // 前端带过来的 Bearer token

  try {
    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify({
        model: model || 'doubao-seedream-4-0-250828',
        prompt,
        size: size || '2K',
        sequential_image_generation: 'disabled',
        stream: false,
        response_format: 'url',
        watermark: watermark !== 'false'
      })
    });

    if (!response.ok) throw new Error(await response.text());

    const data = await response.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}