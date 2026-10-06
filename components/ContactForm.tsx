'use client';

import { useState, useRef } from 'react';

const COUNTRY_CODES = [
  { name: 'India', code: '+91' },
  { name: 'Singapore', code: '+65' },
  { name: 'Malaysia', code: '+60' },
  { name: 'Indonesia', code: '+62' },
  { name: 'Thailand', code: '+66' },
  { name: 'Vietnam', code: '+84' },
  { name: 'Philippines', code: '+63' },
  { name: 'China', code: '+86' },
  { name: 'Hong Kong', code: '+852' },
  { name: 'Taiwan', code: '+886' },
  { name: 'UAE', code: '+971' },
  { name: 'Saudi Arabia', code: '+966' },
  { name: 'Qatar', code: '+974' },
  { name: 'Oman', code: '+968' },
  { name: 'Kuwait', code: '+965' },
  { name: 'Bahrain', code: '+973' },
  { name: 'USA/Canada', code: '+1' },
  { name: 'UK', code: '+44' },
  { name: 'Australia', code: '+61' },
  { name: 'Japan', code: '+81' },
  { name: 'Germany', code: '+49' },
  { name: 'France', code: '+33' },
  { name: 'Netherlands', code: '+31' },
];

const ROLES = [
  'Founder / CEO',
  'CXO / Leadership team',
  'Business unit head',
  'Investor / Board',
];

const TOPICS = [
  'Growth & revenue strategy',
  'Market expansion',
  'A large deal pursuit',
  'Operating model & organisation',
  'AI & business transformation',
  'Profitability & performance',
  'Something else',
];

export default function ContactForm() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    workEmail: '',
    company: '',
    role: '',
    topic: '',
    countryCode: '+91',
    phone: '',
    message: '',
    website: '', // honeypot
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [alertError, setAlertError] = useState('');

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'firstName':
        return value.trim() ? '' : 'Enter your first name.';
      case 'lastName':
        return value.trim() ? '' : 'Enter your last name.';
      case 'workEmail':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
          ? ''
          : 'Enter a valid email, like name@company.com.';
      case 'company':
        return value.trim() ? '' : 'Enter your company name.';
      case 'message':
        return value.trim().length >= 10
          ? ''
          : 'Add a line or two about the situation.';
      default:
        return '';
    }
  };

  const handleBlur = (field: string) => {
    const error = validateField(field, formData[field as keyof typeof formData]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertError('');

    // Spam trap
    if (formData.website) return;

    const newErrors: Record<string, string> = {
      firstName: validateField('firstName', formData.firstName),
      lastName: validateField('lastName', formData.lastName),
      workEmail: validateField('workEmail', formData.workEmail),
      company: validateField('company', formData.company),
      message: validateField('message', formData.message),
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some(Boolean);
    if (hasError) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(result.error || 'Failed to send');
      }

      setIsSubmitted(true);
      if (typeof window !== 'undefined') {
        const dataLayer = (window as unknown as { dataLayer?: unknown[] }).dataLayer;
        if (dataLayer) {
          dataLayer.push({ event: 'contact_form_sent' });
        }
        // Smoothly scroll the card into view so the user immediately sees the confirmation
        setTimeout(() => {
          containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 50);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Your message wasn't sent.";
      setAlertError(
        errorMessage.includes('configuration')
          ? "The form is in test mode. Please contact anurag@ladderframe.in directly."
          : "Your message wasn't sent. Please try again, or email anurag@ladderframe.in directly."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      workEmail: '',
      company: '',
      role: '',
      topic: '',
      countryCode: '+91',
      phone: '',
      message: '',
      website: '',
    });
    setErrors({});
    setAlertError('');
    setIsSubmitted(false);
  };

  return (
    <div className="contact-form-card" ref={containerRef} aria-labelledby="form-title">
      {!isSubmitted ? (
        <div id="form-view">
          <div className="card-head">
            <h2 id="form-title">Send a note</h2>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-row-2col">
              <div className={`form-field-group ${errors.firstName ? 'bad' : ''}`}>
                <label htmlFor="first">First name</label>
                <input
                  id="first"
                  name="first_name"
                  type="text"
                  autoComplete="given-name"
                  required
                  placeholder="James"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  onBlur={() => handleBlur('firstName')}
                />
                <span className="field-error-msg">{errors.firstName}</span>
              </div>

              <div className={`form-field-group ${errors.lastName ? 'bad' : ''}`}>
                <label htmlFor="last">Last name</label>
                <input
                  id="last"
                  name="last_name"
                  type="text"
                  autoComplete="family-name"
                  required
                  placeholder="Bond"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  onBlur={() => handleBlur('lastName')}
                />
                <span className="field-error-msg">{errors.lastName}</span>
              </div>
            </div>

            <div className="form-row-2col">
              <div className={`form-field-group ${errors.workEmail ? 'bad' : ''}`}>
                <label htmlFor="email">Work email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@company.com"
                  value={formData.workEmail}
                  onChange={(e) => handleChange('workEmail', e.target.value)}
                  onBlur={() => handleBlur('workEmail')}
                />
                <span className="field-error-msg">{errors.workEmail}</span>
              </div>

              <div className={`form-field-group ${errors.company ? 'bad' : ''}`}>
                <label htmlFor="company">Company</label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  required
                  placeholder="Company name"
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  onBlur={() => handleBlur('company')}
                />
                <span className="field-error-msg">{errors.company}</span>
              </div>
            </div>

            <div className="form-row-2col">
              <div className="form-field-group">
                <label htmlFor="role">
                  Your role <span className="opt-label">(optional)</span>
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                >
                  <option value="">Select</option>
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field-group">
                <label htmlFor="topic">
                  What would you like to discuss? <span className="opt-label">(optional)</span>
                </label>
                <select
                  id="topic"
                  name="topic"
                  value={formData.topic}
                  onChange={(e) => handleChange('topic', e.target.value)}
                >
                  <option value="">Select a topic</option>
                  {TOPICS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-field-group">
              <label htmlFor="phone">
                Phone <span className="opt-label">(optional)</span>
              </label>
              <div className="phone-input-split">
                <select
                  id="cc"
                  name="country_code"
                  aria-label="Country code"
                  value={formData.countryCode}
                  onChange={(e) => handleChange('countryCode', e.target.value)}
                >
                  {COUNTRY_CODES.map((item) => (
                    <option key={item.name + item.code} value={item.code}>
                      {item.name} {item.code}
                    </option>
                  ))}
                </select>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel-national"
                  inputMode="tel"
                  placeholder="98200 00000"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
              </div>
            </div>

            <div className={`form-field-group ${errors.message ? 'bad' : ''}`}>
              <label htmlFor="message">Anything else we should know?</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                placeholder="A few lines about the situation are enough."
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                onBlur={() => handleBlur('message')}
              />
              <span className="field-error-msg">{errors.message}</span>
            </div>

            {/* Spam Trap */}
            <div className="hp-field" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={formData.website}
                onChange={(e) => handleChange('website', e.target.value)}
              />
            </div>

            <p className="consent-text">
              By sending, you agree to be contacted by LadderFrame about your enquiry.
            </p>

            {alertError && <p className="alert-error">{alertError}</p>}

            <button
              type="submit"
              id="send"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending…' : 'Send'} <span className="btn-arrow">&rarr;</span>
            </button>
          </form>
        </div>
      ) : (
        <div className="form-done-view" id="done-view">
          <div className="form-done-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <div className="form-done-badge">Enquiry Received</div>
          <h2>Message received.</h2>
          <p className="form-done-lead">
            Thank you for reaching out. We have received your note and will review the details promptly.
          </p>
          <p className="form-done-sub">
            You can expect a direct response within <strong>one business day</strong>.
          </p>
          <div className="form-done-action">
            <button
              type="button"
              className="btn btn-secondary btn-again"
              onClick={handleReset}
            >
              Send another message <span className="btn-arrow">&rarr;</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
