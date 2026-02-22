import { useState } from 'react';

const MAX_MESSAGE_LENGTH = 200;
const API_URL = '/api';

export default function App() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  const [showExport, setShowExport] = useState(false);
  const [exportKey, setExportKey] = useState('');
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState(null);

  const handleMessageChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_MESSAGE_LENGTH) setMessage(value);
  };

  const handleExportExcel = async (e) => {
    e?.preventDefault();
    setExporting(true);
    setExportError(null);
    try {
      const res = await fetch(`${API_URL}/messages/export`, {
        headers: exportKey ? { Authorization: `Bearer ${exportKey}` } : {},
      });
      if (res.status === 401) {
        setExportError('Invalid export key.');
        return;
      }
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `messages-${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      setExportError('Could not export. Is the backend running?');
    } finally {
      setExporting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/send-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          contact: contact.trim(),
          message: message.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
        return;
      }

      setStatus('Message sent successfully!');
      setName('');
      setContact('');
      setMessage('');
    } catch (err) {
      setError('Could not reach the server. Is the backend running?');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
          <h1 className="text-2xl font-semibold text-slate-800 mb-1">
            Send a message
          </h1>
          <p className="text-slate-500 text-sm mb-6">
            We&apos;ll get back to you soon.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your name"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-transparent transition"
              />
            </div>

            <div>
              <label
                htmlFor="contact"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Contact
              </label>
              <input
                id="contact"
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
                placeholder="Email or phone"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-transparent transition"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-slate-700"
                >
                  Message
                </label>
                <span className="text-xs text-slate-400">
                  {message.length}/{MAX_MESSAGE_LENGTH}
                </span>
              </div>
              <textarea
                id="message"
                value={message}
                onChange={handleMessageChange}
                required
                maxLength={MAX_MESSAGE_LENGTH}
                rows={4}
                placeholder="Your message..."
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-transparent transition resize-none"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}
            {status && (
              <p className="text-sm text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
                {status}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-slate-800 text-white font-medium hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition"
            >
              Send message
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={() => setShowExport((s) => !s)}
              className="text-xs text-slate-400 hover:text-slate-600 transition"
            >
              {showExport ? 'Hide admin export' : 'Admin: Export data'}
            </button>
            {showExport && (
              <form
                onSubmit={handleExportExcel}
                className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3"
              >
                <label className="block text-left text-sm font-medium text-slate-600">
                  Export key
                </label>
                <input
                  type="password"
                  value={exportKey}
                  onChange={(e) => setExportKey(e.target.value)}
                  placeholder="Enter your export key"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                  autoComplete="off"
                />
                {exportError && (
                  <p className="text-sm text-red-600">{exportError}</p>
                )}
                <button
                  type="submit"
                  disabled={exporting}
                  className="w-full py-2 rounded-lg bg-slate-700 text-white text-sm font-medium hover:bg-slate-600 disabled:opacity-50"
                >
                  {exporting ? 'Exporting…' : 'Download Excel'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
