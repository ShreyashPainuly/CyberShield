/**
 * CyberShield URL Analysis Engine
 * Performs multi-factor threat analysis on URLs
 */

const blacklist = require('./blacklist');

class URLAnalyzer {
  constructor() {
    this.suspiciousTLDs = new Set([
      'tk', 'ml', 'ga', 'cf', 'gq', 'xyz', 'top', 'work', 'click',
      'link', 'buzz', 'surf', 'icu', 'monster', 'rest', 'sbs',
      'beauty', 'hair', 'quest', 'uno', 'mom', 'bar'
    ]);

    this.urlShorteners = new Set([
      'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd',
      'buff.ly', 'adf.ly', 'bit.do', 'mcaf.ee', 'su.pr', 'tiny.cc',
      'yourls.org', 'rebrand.ly', 'bl.ink', 'short.io', 'cutt.ly'
    ]);

    this.phishingKeywords = [
      'login', 'signin', 'sign-in', 'verify', 'verification', 'secure',
      'account', 'update', 'confirm', 'banking', 'password', 'credential',
      'suspend', 'restricted', 'unlock', 'alert', 'urgent', 'immediately',
      'expire', 'validate', 'wallet', 'paypal', 'apple-id', 'microsoft',
      'amazon-security', 'netflix-payment', 'google-verify', 'facebook-confirm',
      'whatsapp', 'telegram-auth', 'instagram-verify'
    ];

    this.trustedDomains = new Set([
      'google.com', 'youtube.com', 'facebook.com', 'amazon.com', 'wikipedia.org',
      'twitter.com', 'x.com', 'instagram.com', 'linkedin.com', 'reddit.com',
      'github.com', 'stackoverflow.com', 'microsoft.com', 'apple.com',
      'netflix.com', 'spotify.com', 'whatsapp.com', 'telegram.org',
      'yahoo.com', 'bing.com', 'duckduckgo.com', 'cloudflare.com',
      'aws.amazon.com', 'azure.microsoft.com', 'console.cloud.google.com',
      'npmjs.com', 'pypi.org', 'docs.python.org', 'developer.mozilla.org'
    ]);
  }

  /**
   * Main analysis entry point
   * @param {string} urlString - The URL to analyze
   * @returns {Object} Full analysis result
   */
  analyze(urlString) {
    const threats = [];
    let totalScore = 0;

    // Normalize URL
    let normalizedUrl = urlString.trim();
    if (!normalizedUrl.match(/^https?:\/\//i)) {
      normalizedUrl = 'http://' + normalizedUrl;
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(normalizedUrl);
    } catch (e) {
      return {
        url: urlString,
        normalizedUrl,
        riskScore: 85,
        riskLevel: 'dangerous',
        threats: [{ factor: 'Invalid URL', description: 'The URL format is invalid or malformed', points: 85 }],
        details: {
          protocol: 'unknown',
          hostname: 'unknown',
          path: '',
          hasSSL: false,
          ipBased: false,
          redirectCount: 0
        }
      };
    }

    const hostname = parsedUrl.hostname.toLowerCase();
    const fullUrl = normalizedUrl.toLowerCase();
    const path = parsedUrl.pathname + parsedUrl.search;

    // ── Check: Trusted domain (early exit) ──────────────────────
    const rootDomain = this._getRootDomain(hostname);
    if (this.trustedDomains.has(rootDomain) || this.trustedDomains.has(hostname)) {
      const hasSSL = parsedUrl.protocol === 'https:';
      return {
        url: urlString,
        normalizedUrl,
        riskScore: hasSSL ? 0 : 5,
        riskLevel: 'safe',
        threats: hasSSL ? [] : [{ factor: 'No HTTPS', description: 'Connection is not encrypted', points: 5 }],
        details: {
          protocol: parsedUrl.protocol,
          hostname,
          path,
          hasSSL,
          ipBased: false,
          redirectCount: 0
        }
      };
    }

    // ── Check 1: Blacklist ──────────────────────────────────────
    const blacklistResult = blacklist.check(hostname, fullUrl);
    if (blacklistResult.matched) {
      threats.push({
        factor: 'Blacklisted',
        description: `Matches known malicious pattern: ${blacklistResult.pattern}`,
        points: 30
      });
      totalScore += 30;
    }

    // ── Check 2: IP address as hostname ─────────────────────────
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^\[?[0-9a-fA-F:]+\]?$/;
    if (ipRegex.test(hostname) || ipv6Regex.test(hostname)) {
      threats.push({
        factor: 'IP-based URL',
        description: 'URL uses an IP address instead of a domain name — common in phishing',
        points: 25
      });
      totalScore += 25;
    }

    // ── Check 3: Suspicious TLD ─────────────────────────────────
    const tld = hostname.split('.').pop();
    if (this.suspiciousTLDs.has(tld)) {
      threats.push({
        factor: 'Suspicious TLD',
        description: `The ".${tld}" domain extension is frequently used in phishing campaigns`,
        points: 15
      });
      totalScore += 15;
    }

    // ── Check 4: Excessive subdomains ───────────────────────────
    const subdomainCount = hostname.split('.').length - 2;
    if (subdomainCount > 3) {
      threats.push({
        factor: 'Excessive Subdomains',
        description: `URL has ${subdomainCount} subdomains — may be hiding actual domain`,
        points: 10
      });
      totalScore += 10;
    }

    // ── Check 5: @ symbol in URL ────────────────────────────────
    if (fullUrl.includes('@')) {
      threats.push({
        factor: 'Contains @ Symbol',
        description: 'The @ symbol in URLs can redirect to a different destination than displayed',
        points: 20
      });
      totalScore += 20;
    }

    // ── Check 6: URL shortener ──────────────────────────────────
    if (this.urlShorteners.has(hostname)) {
      threats.push({
        factor: 'URL Shortener',
        description: 'Shortened URLs hide the actual destination — potential redirect to malicious site',
        points: 10
      });
      totalScore += 10;
    }

    // ── Check 7: Phishing keywords ──────────────────────────────
    const foundKeywords = this.phishingKeywords.filter(kw =>
      fullUrl.includes(kw) || path.includes(kw)
    );
    if (foundKeywords.length > 0) {
      const keywordPoints = Math.min(foundKeywords.length * 5, 15);
      threats.push({
        factor: 'Phishing Keywords',
        description: `Contains suspicious terms: ${foundKeywords.slice(0, 3).join(', ')}`,
        points: keywordPoints
      });
      totalScore += keywordPoints;
    }

    // ── Check 8: Unusual port ───────────────────────────────────
    const port = parsedUrl.port;
    if (port && !['80', '443', '8080', '8443'].includes(port)) {
      threats.push({
        factor: 'Unusual Port',
        description: `Non-standard port ${port} — legitimate sites rarely use custom ports`,
        points: 10
      });
      totalScore += 10;
    }

    // ── Check 9: Excessive URL length ───────────────────────────
    if (fullUrl.length > 75) {
      const lengthPoints = fullUrl.length > 150 ? 10 : 5;
      threats.push({
        factor: 'Excessive Length',
        description: `URL is ${fullUrl.length} characters long — may be hiding content`,
        points: lengthPoints
      });
      totalScore += lengthPoints;
    }

    // ── Check 10: Encoded characters ────────────────────────────
    const encodedCount = (fullUrl.match(/%[0-9A-Fa-f]{2}/g) || []).length;
    if (encodedCount > 3) {
      threats.push({
        factor: 'Encoded Characters',
        description: `Contains ${encodedCount} encoded characters — may be obfuscating content`,
        points: 10
      });
      totalScore += 10;
    }

    // ── Check 11: Homograph attack (mixed scripts) ──────────────
    if (/[^\x00-\x7F]/.test(hostname)) {
      threats.push({
        factor: 'Internationalized Domain',
        description: 'Domain contains non-ASCII characters — potential homograph attack',
        points: 15
      });
      totalScore += 15;
    }

    // ── Check 12: Double extension in path ──────────────────────
    if (/\.(exe|zip|rar|bat|cmd|scr|js|vbs|msi|dll|pdf)\./i.test(path)) {
      threats.push({
        factor: 'Suspicious File Extension',
        description: 'Path contains double file extensions — common malware delivery technique',
        points: 15
      });
      totalScore += 15;
    }

    // ── Bonus: HTTPS reduction ──────────────────────────────────
    const hasSSL = parsedUrl.protocol === 'https:';
    if (hasSSL && totalScore > 0) {
      totalScore = Math.max(0, totalScore - 10);
    } else if (!hasSSL) {
      threats.push({
        factor: 'No HTTPS',
        description: 'Connection is not encrypted — data could be intercepted',
        points: 5
      });
      totalScore += 5;
    }

    // Cap at 100
    totalScore = Math.min(totalScore, 100);

    // Determine risk level
    let riskLevel;
    if (totalScore <= 30) riskLevel = 'safe';
    else if (totalScore <= 60) riskLevel = 'suspicious';
    else riskLevel = 'dangerous';

    return {
      url: urlString,
      normalizedUrl,
      riskScore: totalScore,
      riskLevel,
      threats,
      details: {
        protocol: parsedUrl.protocol,
        hostname,
        path,
        hasSSL,
        ipBased: ipRegex.test(hostname),
        redirectCount: 0
      }
    };
  }

  /**
   * Extract root domain from hostname
   */
  _getRootDomain(hostname) {
    const parts = hostname.split('.');
    if (parts.length <= 2) return hostname;
    return parts.slice(-2).join('.');
  }
}

module.exports = new URLAnalyzer();
