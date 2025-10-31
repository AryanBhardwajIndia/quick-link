import { useState } from 'react';
import { Copy, Link, ExternalLink } from 'lucide-react';
import './App.css';

export default function URLShortener() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const API_URL = 'https://t4vyk9byu0.execute-api.eu-north-1.amazonaws.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShortUrl('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ originalUrl: url }),
      });

      const data = await response.json();

      if (response.ok) {
        setShortUrl(data.shortUrl);
      } else {
        setError(data.error || 'Failed to shorten URL');
      }
    } catch (err) {
      setError('Failed to connect to server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container">
      <div className="card">
        <div className="icon-container">
          <Link className="icon" />
        </div>
        
        <h1 className="title">QuickLink</h1>
        <p className="subtitle">
          Make your links shorter and easier to share
        </p>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="url" className="label">
              Enter your long URL
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/very/long/url"
              required
              className="input"
            />
          </div>

          <button type="submit" disabled={loading} className="btn">
            {loading ? 'Shortening...' : 'Shorten URL'}
          </button>
        </form>

        {error && (
          <div className="alert alert-error">
            <p>{error}</p>
          </div>
        )}

        {shortUrl && (
          <div className="alert alert-success">
            <p className="result-label">Your shortened URL:</p>
            <div className="result-container">
              <input
                type="text"
                value={shortUrl}
                readOnly
                className="result-input"
              />
              <button
                onClick={copyToClipboard}
                className="icon-btn copy-btn"
                title="Copy to clipboard"
              >
                <Copy />
              </button>
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-btn open-btn"
                title="Open link"
              >
                <ExternalLink />
              </a>
            </div>
            {copied && (
              <p className="copied-text">Copied to clipboard!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}