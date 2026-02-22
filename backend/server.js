const express = require('express');
const cors = require('cors');
const XLSX = require('xlsx');

const app = express();
const PORT = process.env.PORT || 3001;

// In production, set FRONTEND_URL (e.g. https://your-app.vercel.app) to restrict CORS
const corsOrigin = process.env.FRONTEND_URL || true;
app.use(cors({ origin: corsOrigin }));
app.use(express.json());

const MAX_MESSAGE_LENGTH = 200;

// In-memory store for all messages
const messages = [];

app.post('/send-message', (req, res) => {
  const { name, contact, message } = req.body;

  if (!name || !contact || !message) {
    return res.status(400).json({
      error: 'Missing required fields: name, contact, and message are required.',
    });
  }

  if (typeof message !== 'string' || message.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({
      error: `Message must be a string and at most ${MAX_MESSAGE_LENGTH} characters.`,
    });
  }

  const payload = {
    id: messages.length + 1,
    name: String(name).trim(),
    contact: String(contact).trim(),
    message: message.trim(),
    receivedAt: new Date().toISOString(),
  };

  messages.push(payload);

  console.log('--- New message ---');
  console.log('Name:', payload.name);
  console.log('Contact:', payload.contact);
  console.log('Message:', payload.message);
  console.log('-------------------');

  res.status(200).json({ success: true, message: 'Message received.' });
});

// Export all messages as Excel (.xlsx) — only if correct secret is provided
const EXPORT_SECRET = process.env.EXPORT_SECRET;

app.get('/messages/export', (req, res) => {
  const authHeader = req.get('Authorization');
  const bearer = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  const queryKey = req.query.key || '';

  const providedKey = bearer || queryKey;

  if (EXPORT_SECRET && EXPORT_SECRET.length > 0) {
    if (providedKey !== EXPORT_SECRET) {
      return res.status(401).json({ error: 'Invalid or missing export key.' });
    }
  }

  const headers = ['#', 'Name', 'Contact', 'Message', 'Received at'];
  const rows = messages.map((m) => [
    m.id,
    m.name,
    m.contact,
    m.message,
    m.receivedAt,
  ]);
  const data = [headers, ...rows];

  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Messages');

  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  const filename = `messages-${new Date().toISOString().slice(0, 10)}.xlsx`;

  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(buffer);
});

app.listen(PORT, () => {
  console.log(`Server is now running and listening on port ${PORT}`);   
});
