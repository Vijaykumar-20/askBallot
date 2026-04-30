import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AssistantPanel from '@/components/Chat/AssistantPanel';

global.fetch = vi.fn();

describe('AssistantPanel Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when closed', () => {
    const { container } = render(<AssistantPanel isOpen={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders and handles input submission successfully', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({ role: 'model', parts: [{ text: 'Mock AI response' }] })
    });
    
    render(<AssistantPanel isOpen={true} onClose={vi.fn()} />);
    
    const input = screen.getByPlaceholderText(/Ask anything/i);
    fireEvent.change(input, { target: { value: 'Hello' } });
    
    const form = input.closest('form');
    fireEvent.submit(form);
    
    expect(await screen.findByText('Hello')).toBeInTheDocument();
    expect(await screen.findByText('Mock AI response')).toBeInTheDocument();
  });

  it('handles API errors', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({ error: 'Failed' })
    });
    
    render(<AssistantPanel isOpen={true} onClose={vi.fn()} />);
    
    fireEvent.change(screen.getByPlaceholderText(/Ask anything/i), { target: { value: 'Hello' } });
    fireEvent.submit(screen.getByPlaceholderText(/Ask anything/i).closest('form'));
    
    expect(await screen.findByText('Sorry, something went wrong. Please try again.')).toBeInTheDocument();
  });

  it('handles empty input gracefully', () => {
    render(<AssistantPanel isOpen={true} onClose={vi.fn()} />);
    
    fireEvent.submit(screen.getByPlaceholderText(/Ask anything/i).closest('form'));
    
    // Should not fetch
    expect(fetch).not.toHaveBeenCalled();
  });
});
