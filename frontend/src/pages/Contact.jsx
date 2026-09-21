import React, { useState } from 'react';
import { Mail, Send, CheckCircle, HelpCircle, Server, Terminal, Shield } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function Contact() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', message: '', subject: 'support' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please complete all required fields', 'error');
      return;
    }
    setSubmitted(true);
    showToast('Feedback message submitted successfully!', 'success');
  };

  return (
    <div className="contact-page-container">
      <div className="page-header-card mb-6">
        <span className="badge badge-dev font-mono mb-2 inline-block">Lazy Loaded Route Component</span>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Mail className="text-indigo-400" size={24} /> Support & Contact
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Have feedback or technical questions about TaskPulse or Practical 8 implementation? Reach out below.
        </p>
      </div>

      <div className="contact-grid">
        {/* Contact Form */}
        <div className="card-surface p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Send size={18} className="text-indigo-400" /> Send a Message
          </h3>

          {submitted ? (
            <div className="p-6 text-center bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
              <CheckCircle className="text-emerald-400 mx-auto mb-2" size={40} />
              <h4 className="font-bold text-lg text-emerald-400">Message Received!</h4>
              <p className="text-sm text-slate-300 mt-1">
                Thank you, {formData.name}. Our engineering team will review your inquiry shortly.
              </p>
              <button
                onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', message: '', subject: 'support' }); }}
                className="btn btn-secondary btn-sm mt-4"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="form-layout space-y-4">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Divy V."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="e.g. student@college.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <select
                  className="form-select"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                >
                  <option value="support">Technical Support</option>
                  <option value="performance">Performance & Lazy Loading</option>
                  <option value="bug">Report a Bug</option>
                  <option value="general">General Inquiry</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  placeholder="Describe your feedback or request..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary w-full flex justify-center items-center gap-2">
                <Send size={16} /> Submit Feedback
              </button>
            </form>
          )}
        </div>

        {/* System Info & FAQs */}
        <div className="space-y-6">
          <div className="card-surface p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Server size={18} className="text-indigo-400" /> System Diagnostics
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-slate-400">Frontend Stack:</span>
                <span className="font-mono text-indigo-400">React 18 + Vite 6</span>
              </li>
              <li className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-slate-400">Routing Method:</span>
                <span className="font-mono text-emerald-400">React.lazy() Code Splitting</span>
              </li>
              <li className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-slate-400">Backend API:</span>
                <span className="font-mono text-indigo-400">Express / Node.js :5000</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-slate-400">Database Engine:</span>
                <span className="font-mono text-emerald-400">MongoDB Atlas / Local</span>
              </li>
            </ul>
          </div>

          <div className="card-surface p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <HelpCircle size={18} className="text-amber-400" /> Frequently Asked Questions
            </h3>
            <div className="space-y-3 text-sm">
              <details className="faq-item p-3 rounded-lg bg-slate-800/40 border border-white/5">
                <summary className="font-medium cursor-pointer text-slate-200">
                  How does lazy loading improve app load time?
                </summary>
                <p className="text-xs text-slate-400 mt-2">
                  Instead of bundling all routes into one massive <code>main.js</code> download, React loads only the code needed for the active page upfront. Remaining pages are fetched on-demand when clicked.
                </p>
              </details>

              <details className="faq-item p-3 rounded-lg bg-slate-800/40 border border-white/5">
                <summary className="font-medium cursor-pointer text-slate-200">
                  What happens when network connection is slow?
                </summary>
                <p className="text-xs text-slate-400 mt-2">
                  The <code>Suspense</code> component catches the asynchronous chunk promise and displays the <code>LoadingFallback</code> UI until the JavaScript asset finishes downloading.
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
