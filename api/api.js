const crypto = require('crypto');
const querystring = require('querystring');

const CONFIG = {
  api_key: 'c66289394c2a6e8515c8e8b382fba719',
  offer_id: 14537,
  user_id: 75329,
  api_domain: 'https://t-api.org'
};

function redirect(res, url) {
  res.writeHead(302, { Location: url });
  res.end();
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return redirect(res, '/');
  }

  let body = req.body || {};
  if (typeof body === 'string') {
    body = querystring.parse(body);
  } else if (Buffer.isBuffer(body)) {
    body = querystring.parse(body.toString('utf-8'));
  }

  const name = body.name ? String(body.name).trim() : '';
  const phone = body.phone ? String(body.phone).trim() : '';

  if (!name || !phone) {
    const referer = req.headers.referer || '/';
    return redirect(res, referer);
  }

  const ip =
    req.headers['http_cf_connecting_ip'] ||
    req.headers['cf-connecting-ip'] ||
    req.headers['x-client-ip'] ||
    (req.headers['x-forwarded-for'] ? String(req.headers['x-forwarded-for']).split(',')[0].trim() : null) ||
    req.socket?.remoteAddress ||
    '127.0.0.1';

  const userAgent = req.headers['user-agent'] || null;
  const query = req.query || {};

  const params = {
    name: name,
    phone: phone,
    country: body.country || 'HU',
    tz: 2,
    stream_id: '409418',
    region: body.region || null,
    city: body.city || null,
    count: body.count || null,
    address: body.address || null,
    email: body.email || null,
    zip: body.zip || null,
    user_comment: body.user_comment || null,
    referer: req.headers.referer || null,
    user_agent: userAgent,
    ip: ip,

    utm_source: query.utm_source || null,
    utm_medium: query.utm_medium || null,
    utm_campaign: query.utm_campaign || null,
    utm_term: query.utm_term || null,
    utm_content: query.utm_content || null,

    sub_id: query.sub_id || null,
    sub_id_1: query.sub_id_1 || null,
    sub_id_2: query.sub_id_2 || null,
    sub_id_3: query.sub_id_3 || null,
    sub_id_4: query.sub_id_4 || null,
  };

  const notRequireParams = [
    'tz', 'address', 'region', 'city', 'zip', 'stream_id', 'count', 'email', 'user_comment',
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
    'sub_id', 'sub_id_1', 'sub_id_2', 'sub_id_3', 'sub_id_4',
    'referer', 'user_agent', 'ip'
  ];

  const leadData = {
    name: params.name,
    phone: params.phone,
    offer_id: CONFIG.offer_id,
    country: params.country
  };

  for (const key of notRequireParams) {
    if (params[key] !== null && params[key] !== undefined) {
      leadData[key] = params[key];
    }
  }

  const postPayload = {
    user_id: CONFIG.user_id,
    data: leadData
  };

  const jsonData = JSON.stringify(postPayload);
  const checkSum = crypto.createHash('sha1').update(jsonData + CONFIG.api_key).digest('hex');

  const apiUrl = `${CONFIG.api_domain}/api/lead/create?check_sum=${checkSum}`;

  try {
    const apiRes = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: jsonData
    });

    const result = await apiRes.json();

    if (result && result.status === 'ok' && result.data && result.data.id) {
      return redirect(res, `/success.html?id=${result.data.id}`);
    } else {
      console.error('Terra API response error:', result);
      return redirect(res, `/success.html`);
    }
  } catch (err) {
    console.error('Terra API request failed:', err);
    return redirect(res, `/success.html`);
  }
};
