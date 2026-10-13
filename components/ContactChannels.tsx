'use client';

import { useState } from 'react';

export default function ContactChannels() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    const email = 'anurag@ladderframe.in';
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(email);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = email;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="contact-channels-container">
      <div className="contact-direct-table">
        <div className="direct-row">
          <span className="direct-label">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
            EMAIL
          </span>
          <span className="direct-val">
            <a href="mailto:anurag@ladderframe.in" className="direct-link">
              <span>anurag@ladderframe.in</span>
              <svg className="direct-link-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="7" y1="17" x2="17" y2="7"/>
                <polyline points="7 7 17 7 17 17"/>
              </svg>
            </a>
          </span>
          <div className="direct-actions">
            <button
              type="button"
              className="btn-copy"
              onClick={handleCopyEmail}
              aria-label="Copy email address"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="direct-row">
          <span className="direct-label">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            WHATSAPP
          </span>
          <span className="direct-val">
            <a
              href="https://wa.me/919930133194"
              target="_blank"
              rel="noopener noreferrer"
              className="direct-link"
            >
              <span>+91 99301 33194</span>
              <svg className="direct-link-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="7" y1="17" x2="17" y2="7"/>
                <polyline points="7 7 17 7 17 17"/>
              </svg>
            </a>
          </span>
          <div className="direct-actions">
            <a
              href="https://wa.me/919930133194"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-direct-action"
              aria-label="Chat on WhatsApp"
            >
              Chat <span className="btn-direct-action-arrow" aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

      </div>

      <div className="contact-trust-badges">
        <div className="contact-trust-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <span>Response within 1 business day</span>
        </div>
        <div className="contact-trust-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span>Direct executive-to-executive discretion</span>
        </div>
      </div>
    </div>
  );
}
