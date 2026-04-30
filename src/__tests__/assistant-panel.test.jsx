import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AssistantPanel from '@/components/Chat/AssistantPanel';

describe('AssistantPanel Component', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders nothing when closed', () => {
    const { container } = render(<AssistantPanel isOpen={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders and handles input submission successfully', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ role: 'model', parts: [{ text: 'Mock AI response' }] })
    });
    
    render(<AssistantPanel isOpen={true} onClose={vi.fn()} />);
    
    const input = screen.getByPlaceholderText(/Ask anything/i);
    fireEvent.change(input, { target: { value: 'Hello' } });
    
    fireEvent.submit(input.closest('form'));
    
    expect(await screen.findByText('Hello')).toBeInTheDocument();
    expect(await screen.findByText('Mock AI response')).toBeInTheDocument();
  });

  it('handles API errors', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Failed' })
    });
    
    render(<AssistantPanel isOpen={true} onClose={vi.fn()} />);
    
    const input = screen.getByPlaceholderText(/Ask anything/i);
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.submit(input.closest('form'));
    
    expect(await screen.findByText('Sorry, something went wrong. Please try again.')).toBeInTheDocument();
  });

  it('handles empty input gracefully', () => {
    render(<AssistantPanel isOpen={true} onClose={vi.fn()} />);
    
    const input = screen.getByPlaceholderText(/Ask anything/i);
    fireEvent.submit(input.closest('form'));
    
    expect(fetch).not.toHaveBeenCalled();
  });
});
