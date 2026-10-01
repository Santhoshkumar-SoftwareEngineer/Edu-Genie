// In-memory token bucket rate limiter for API endpoints
interface RateLimitEntry {
  tokens: number;
  lastRefill: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const MAX_TOKENS = 30; // 30 requests per minute per IP
const REFILL_RATE_PER_SEC = 0.5; // 30 tokens per minute

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  let entry = rateLimitMap.get(ip);

  if (!entry) {
    entry = { tokens: MAX_TOKENS - 1, lastRefill: now };
    rateLimitMap.set(ip, entry);
    return { allowed: true, remaining: MAX_TOKENS - 1 };
  }

  // Refill tokens based on elapsed time
  const elapsedSeconds = (now - entry.lastRefill) / 1000;
  entry.tokens = Math.min(MAX_TOKENS, entry.tokens + elapsedSeconds * REFILL_RATE_PER_SEC);
  entry.lastRefill = now;

  if (entry.tokens >= 1) {
    entry.tokens -= 1;
    return { allowed: true, remaining: Math.floor(entry.tokens) };
  }

  return { allowed: false, remaining: 0 };
}
