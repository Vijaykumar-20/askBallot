import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Shell from '@/components/Layout/Shell';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => {
      const { initial, animate, exit, whileHover, whileTap, whileInView, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

vi.mock('next/image', () => ({
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  default: ({ priority, ...props }) => <img alt="mock" {...props} />
}));

vi.mock('@/context/AssistantContext', () => ({
  AssistantProvider: ({ children }) => <div>{children}</div>,
  useAssistant: () => ({ isOpen: false, closeAssistant: vi.fn(), openAssistant: vi.fn() })
}));

vi.mock('@/components/Chat/AssistantPanel', () => ({
  default: () => <div data-testid="assistant-panel">AssistantPanelMock</div>
}));

vi.mock('@/components/Layout/Footer', () => ({
  default: () => <div data-testid="footer">FooterMock</div>
}));

describe('Shell Component', () => {
  it('should render children, navbar, and footer', () => {
    render(<Shell><div data-testid="child">Child Content</div></Shell>);
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('assistant-panel')).toBeInTheDocument();
  });

  it('should render the desktop menu links', () => {
    render(<Shell>Content</Shell>);
    expect(screen.getByText('Power Hub')).toBeInTheDocument();
    expect(screen.getByText('Quest')).toBeInTheDocument();
    expect(screen.getByText('Deep-Dive')).toBeInTheDocument();
  });

  it('should initialize Google Translate script', () => {
    render(<Shell>Content</Shell>);
    expect(document.scripts.length).toBeGreaterThan(0);
    const scripts = Array.from(document.scripts);
    const translateScript = scripts.find(s => s.src.includes('translate.google.com'));
    expect(translateScript).toBeDefined();
  });

  it('handles mobile menu toggles', () => {
    render(<Shell>Content</Shell>);
    const toggle = screen.getByLabelText(/Toggle mobile menu/i);
    fireEvent.click(toggle);
    const mobileLinks = screen.getAllByText('Power Hub');
    expect(mobileLinks.length).toBe(2); // desktop and mobile
    fireEvent.click(mobileLinks[1]); // Close menu by clicking link
  });
});
