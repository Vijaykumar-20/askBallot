import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Explainers from '@/components/Explainers/StageAccordion';

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

const MOCK_EXPLAINERS_DATA = [
  {
    title: 'What is EVM?',
    content: 'Electronic Voting Machine.',
    image: '/evm.jpg',
    bullets: ['Secure', 'Fast'],
    cta: 'Ask Assistant'
  },
  {
    title: 'What is VVPAT?',
    content: 'Voter Verified Paper Audit Trail.',
  }
];

describe('Explainers Component', () => {
  it('should render all titles in sidebar', () => {
    render(<Explainers data={MOCK_EXPLAINERS_DATA} fact="Fact" onOpenAssistant={vi.fn()} />);
    expect(screen.getAllByText('What is EVM?')[0]).toBeInTheDocument();
    expect(screen.getAllByText('What is VVPAT?')[0]).toBeInTheDocument();
  });

  it('should display the first item content by default', () => {
    render(<Explainers data={MOCK_EXPLAINERS_DATA} fact="Fact" onOpenAssistant={vi.fn()} />);
    expect(screen.getByText('Electronic Voting Machine.')).toBeInTheDocument();
    expect(screen.getByText('Secure')).toBeInTheDocument();
    expect(screen.getByText('Fast')).toBeInTheDocument();
  });

  it('should switch content when clicking sidebar item', () => {
    render(<Explainers data={MOCK_EXPLAINERS_DATA} fact="Fact" onOpenAssistant={vi.fn()} />);
    fireEvent.click(screen.getAllByText('What is VVPAT?')[0]);
    expect(screen.getByText('Voter Verified Paper Audit Trail.')).toBeInTheDocument();
    expect(screen.queryByText('Electronic Voting Machine.')).toBeNull();
  });

  it('should trigger onOpenAssistant when CTA is clicked', () => {
    const mockOnOpen = vi.fn();
    render(<Explainers data={MOCK_EXPLAINERS_DATA} fact="Fact" onOpenAssistant={mockOnOpen} />);
    fireEvent.click(screen.getByText(/Ask Assistant/i));
    expect(mockOnOpen).toHaveBeenCalled();
  });

  it('should display the tip fact', () => {
    render(<Explainers data={MOCK_EXPLAINERS_DATA} fact="This is a pro tip." onOpenAssistant={vi.fn()} />);
    expect(screen.getByText('This is a pro tip.')).toBeInTheDocument();
  });
});
