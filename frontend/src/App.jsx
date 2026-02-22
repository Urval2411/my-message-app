import { useState } from 'react';

const MAX_MESSAGE_LENGTH = 200;
// In production, set VITE_API_URL to your backend URL (e.g. https://your-app.railway.app)
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Profile from LinkedIn: https://www.linkedin.com/in/urval-shah-792b13119/
const PROFILE = {
  name: 'Urval Shah',
  headline: 'Columbia Business School · Oliver Wyman · Nomura · BITS Pilani',
  location: 'New York, NY',
  bio: '7+ years in strategy, consulting & investment banking. MBA from Columbia Business School (Dean\'s List). Senior Consultant at Oliver Wyman. Interested in connecting — send me an initial message below.',
  roles: [
    'Senior Consultant, Oliver Wyman',
    'MBA, Columbia Business School',
    'BITS Pilani — Mech Eng & Finance',
  ],
  linkedInUrl: 'https://www.linkedin.com/in/urval-shah-792b13119/',
};

function LinkedInIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-lg">
        {/* Profile hero */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-8 border border-slate-100 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {PROFILE.name}
              </h1>
              <p className="text-slate-500 text-sm mt-1 font-medium">
                {PROFILE.headline}
              </p>
              <p className="text-slate-400 text-sm mt-0.5 flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden />
                {PROFILE.location}
              </p>
            </div>
            <a
              href={PROFILE.linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0A66C2] text-white text-sm font-medium hover:bg-[#004182] transition shadow-sm"
              aria-label="LinkedIn profile"
            >
              <LinkedInIcon className="w-5 h-5" />
              LinkedIn
            </a>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed mt-5">
            {PROFILE.bio}
          </p>
          {PROFILE.roles?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {PROFILE.roles.map((role, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700"
                >
                  {role}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Contact form */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-8 border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800 mb-1">
            Send an initial message
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            I&apos;ll get back to you soon.
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
