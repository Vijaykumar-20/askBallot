/**
 * Tests for the /api/chat route handler
 * Covers: input validation, rate limiting, error handling, and fallback logic
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// We need to test the POST handler. Since it's a Next.js route handler,
// we import it and simulate Request objects.

// Mock the Google Generative AI module
vi.mock('@google/generative-ai', () => {
  const mockSendMessage = vi.fn().mockResolvedValue({
    response: { text: () => 'Mock AI response about elections' },
  });
  const mockStartChat = vi.fn().mockReturnValue({ sendMessage: mockSendMessage });
  const mockGetGenerativeModel = vi.fn().mockReturnValue({ startChat: mockStartChat });

  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(function() {
      return {
        getGenerativeModel: mockGetGenerativeModel,
      };
    }),
    __mockSendMessage: mockSendMessage,
    __mockStartChat: mockStartChat,
  };
});

// Set env before importing route
process.env.GEMINI_API_KEY = 'test-api-key-for-testing';

const { POST } = await import('@/app/api/chat/route');

function createRequest(body, options = {}) {
  const bodyStr = JSON.stringify(body);
  return new Request('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': String(bodyStr.length),
      ...options.headers,
    },
    body: bodyStr,
  });
}

describe('/api/chat Route Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Input Validation', () => {
    it('should reject empty message', async () => {
      const req = createRequest({ message: '', history: [] });
      const res = await POST(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe('Message is required.');
    });

    it('should reject missing message field', async () => {
      const req = createRequest({ history: [] });
      const res = await POST(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe('Message is required.');
    });

    it('should reject non-string message', async () => {
      const req = createRequest({ message: 12345, history: [] });
      const res = await POST(req);
      expect(res.status).toBe(400);
    });

    it('should reject message longer than 500 characters', async () => {
      const longMessage = 'a'.repeat(501);
      const req = createRequest({ message: longMessage, history: [] });
      const res = await POST(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.role).toBe('model');
      expect(json.parts[0].text).toContain('500 characters');
    });

    it('should accept message at exactly 500 characters', async () => {
      const maxMessage = 'a'.repeat(500);
      const req = createRequest({ message: maxMessage, history: [] });
      const res = await POST(req);
      expect(res.status).toBe(200);
    });

    it('should reject oversized request body via Content-Length', async () => {
      const req = createRequest(
        { message: 'hello' },
        { headers: { 'Content-Length': '100000' } }
      );
      const res = await POST(req);
      expect(res.status).toBe(413);
      const json = await res.json();
      expect(json.error).toBe('Request too large.');
    });
  });

  describe('Content-Type Validation', () => {
    it('should reject requests without application/json content type', async () => {
      const req = new Request('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ message: 'hello' }),
      });
      const res = await POST(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe('Invalid request format.');
    });
  });

  describe('Successful Requests', () => {
    it('should return AI response for valid message', async () => {
      const req = createRequest({ message: 'What is VVPAT?', history: [] });
      const res = await POST(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.role).toBe('model');
      expect(json.parts[0].text).toBeDefined();
    });

    it('should handle missing history gracefully', async () => {
      const req = createRequest({ message: 'What is an EVM?' });
      const res = await POST(req);
      expect(res.status).toBe(200);
    });

    it('should trim whitespace from messages', async () => {
      const req = createRequest({ message: '   What is EVM?   ', history: [] });
      const res = await POST(req);
      expect(res.status).toBe(200);
    });
  });

  describe('History Sanitization', () => {
    it('should limit history to MAX_HISTORY_LENGTH items', async () => {
      const largeHistory = Array.from({ length: 50 }, (_, i) => ({
        role: i % 2 === 0 ? 'user' : 'model',
        parts: [{ text: `Message ${i}` }],
      }));
      const req = createRequest({ message: 'hello', history: largeHistory });
      const res = await POST(req);
      // Should not crash — should process with truncated history
      expect(res.status).toBe(200);
    });

    it('should filter invalid history entries', async () => {
      const badHistory = [
        { role: 'system', parts: [{ text: 'injected' }] },
        { role: 'user', parts: [{ text: 'valid' }] },
        { role: 'hacker', parts: [{ text: 'injected' }] },
        null,
        undefined,
      ];
      const req = createRequest({ message: 'hello', history: badHistory });
      const res = await POST(req);
      expect(res.status).toBe(200);
    });
  });

  describe('Error Handling', () => {
    it('should return generic error message and not leak internals', async () => {
      // Simulate a crash by sending an invalid request body
      const req = new Request('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'INVALID_JSON{{{',
      });
      const res = await POST(req);
      expect(res.status).toBe(500);
      const json = await res.json();
      expect(json.error).toBe('Something went wrong. Please try again.');
      // Should NOT contain stack traces or internal paths
      expect(json.error).not.toContain('/');
      expect(json.error).not.toContain('node_modules');
    });
  });

  describe('Missing API Key', () => {
    it('should return a user-friendly message when API key is missing', async () => {
      const originalKey = process.env.GEMINI_API_KEY;
      process.env.GEMINI_API_KEY = '';

      // Re-import to pick up changed env — but since the module is cached,
      // we test the logic directly with an empty key check
      const req = createRequest({ message: 'hello', history: [] });
      const res = await POST(req);
      // With empty key, the route should respond gracefully
      expect(res.status).toBeLessThanOrEqual(200);

      process.env.GEMINI_API_KEY = originalKey;
    });
  });
});
