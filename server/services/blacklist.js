/**
 * CyberShield Blacklist Service
 * Maintains known malicious domains and URL patterns
 */

const maliciousDomains = new Set([
  // Known phishing domains (examples)
  'secure-login-verify.com',
  'account-update-center.com',
  'paypal-security-check.com',
  'apple-id-verify.net',
  'microsoft-alert.net',
  'amazon-order-confirm.com',
  'netflix-billing-update.com',
  'facebook-security-alert.com',
  'google-account-verify.com',
  'instagram-verify-account.com',
  'bank-security-update.com',
  'crypto-wallet-verify.com',
  'whatsapp-verify.com',
  'telegram-verify.com',
  'linkedin-security.com',
  // Malware test domains
  'malware-test.example.com',
  'malware-download.xyz',
  'trojan-dropper.net',
  'virus-payload.com',
  'ransomware-deploy.xyz'
]);

const maliciousPatterns = [
  /paypal.*\.(?!paypal\.com)/i,
  /apple.*id.*\.(?!apple\.com)/i,
  /microsoft.*\.(?!microsoft\.com)/i,
  /google.*verify.*\.(?!google\.com)/i,
  /amazon.*\.(?!amazon\.com)/i,
  /facebook.*security.*\.(?!facebook\.com)/i,
  /netflix.*billing.*\.(?!netflix\.com)/i,
  /bank.*update/i,
  /secure.*login.*verify/i,
  /account.*suspend/i,
  /crypto.*wallet.*verify/i,
  /free.*gift.*card/i,
  /prize.*winner.*claim/i,
  /lottery.*winner/i,
  /malware[\-_.]?test/i,
  /malware[\-_.]?download/i,
  /trojan[\-_.]?dropper/i,
  /virus[\-_.]?payload/i,
  /ransomware[\-_.]?deploy/i
];

/**
 * Check if a URL or hostname matches known malicious patterns
 * @param {string} hostname - The hostname to check
 * @param {string} fullUrl - The full URL to check
 * @returns {{ matched: boolean, pattern: string }}
 */
function check(hostname, fullUrl) {
  // Check domain blacklist
  if (maliciousDomains.has(hostname)) {
    return { matched: true, pattern: hostname };
  }

  // Check URL patterns
  for (const pattern of maliciousPatterns) {
    if (pattern.test(fullUrl)) {
      return { matched: true, pattern: pattern.source };
    }
  }

  return { matched: false, pattern: null };
}

/**
 * Add a domain to the blacklist
 * @param {string} domain
 */
function addDomain(domain) {
  maliciousDomains.add(domain.toLowerCase());
}

/**
 * Remove a domain from the blacklist
 * @param {string} domain
 */
function removeDomain(domain) {
  maliciousDomains.delete(domain.toLowerCase());
}

/**
 * Get all blacklisted domains
 * @returns {string[]}
 */
function getDomains() {
  return Array.from(maliciousDomains);
}

module.exports = { check, addDomain, removeDomain, getDomains };
