/**
 * Tests for the Timeline (Voter's Quest) component
 * Covers: rendering, level unlocking, navigation, progression
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Timeline from '@/components/Timeline/Timeline';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => {
      const { initial, animate, exit, whileHover, whileTap, whileInView, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
    button: ({ children, ...props }) => {
      const { initial, animate, exit, whileHover, whileTap, whileInView, ...rest } = props;
      return <button {...rest}>{children}</button>;
    },
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

const MOCK_TIMELINE_DATA = [
  {
    stage: 'Voter Registration',
    date: 'Ongoing',
    description: 'Register to vote using Form 6.',
    color: '#FF9933',
    tasks: ['Fill Form 6', 'Upload Proof', 'Verify Roll'],
  },
  {
    stage: 'ECI Announcement',
    date: 'March 16',
    description: 'Election Commission announces the schedule.',
    color: '#FFCC00',
    tasks: ['Check Schedule', 'Locate Booth'],
  },
  {
    stage: 'Nominations',
    date: 'March 20',
    description: 'Candidates file nominations.',
    color: '#A0C000',
    tasks: ['Read Affidavits', 'Check Candidates'],
  },
];

describe('Timeline Component', () => {
  it('should render all timeline stages', () => {
    render(<Timeline data={MOCK_TIMELINE_DATA} />);
    expect(screen.getByText('Voter Registration')).toBeInTheDocument();
    expect(screen.getByText('ECI Announcement')).toBeInTheDocument();
    expect(screen.getByText('Nominations')).toBeInTheDocument();
  });

  it('should show progress counter', () => {
    render(<Timeline data={MOCK_TIMELINE_DATA} />);
    expect(screen.getByText(/1 \/ 3 Stages Explored/)).toBeInTheDocument();
  });

  it('should display first stage details by default', () => {
    render(<Timeline data={MOCK_TIMELINE_DATA} />);
    expect(screen.getByText('Register to vote using Form 6.')).toBeInTheDocument();
    expect(screen.getByText('Stage 1')).toBeInTheDocument();
  });

  it('should show tasks for active stage', () => {
    render(<Timeline data={MOCK_TIMELINE_DATA} />);
    expect(screen.getByText('Fill Form 6')).toBeInTheDocument();
    expect(screen.getByText('Upload Proof')).toBeInTheDocument();
    expect(screen.getByText('Verify Roll')).toBeInTheDocument();
  });

  it('should have "Explore Next Stage" button on the latest unlocked stage', () => {
    render(<Timeline data={MOCK_TIMELINE_DATA} />);
    expect(screen.getByText(/Explore Next Stage/)).toBeInTheDocument();
  });

  it('should unlock next stage when clicking "Explore Next Stage"', () => {
    render(<Timeline data={MOCK_TIMELINE_DATA} />);
    fireEvent.click(screen.getByText(/Explore Next Stage/));
    // Should now show stage 2 details
    expect(screen.getByText('Election Commission announces the schedule.')).toBeInTheDocument();
    expect(screen.getByText('Stage 2')).toBeInTheDocument();
    // Progress should update
    expect(screen.getByText(/2 \/ 3 Stages Explored/)).toBeInTheDocument();
  });

  it('should allow navigating back to previously unlocked stages', () => {
    render(<Timeline data={MOCK_TIMELINE_DATA} />);
    // Unlock stage 2
    fireEvent.click(screen.getByText(/Explore Next Stage/));
    // Click on stage 1 node (the "Voter Registration" text)
    fireEvent.click(screen.getByText('Voter Registration'));
    // Should go back to stage 1 details
    expect(screen.getByText('Register to vote using Form 6.')).toBeInTheDocument();
  });

  it('should not allow clicking locked stages', () => {
    render(<Timeline data={MOCK_TIMELINE_DATA} />);
    // Click on stage 3 directly (which is locked)
    fireEvent.click(screen.getByText('Nominations'));
    // Should still show stage 1 (not stage 3)
    expect(screen.getByText('Register to vote using Form 6.')).toBeInTheDocument();
    expect(screen.getByText('Stage 1')).toBeInTheDocument();
  });

  it('should unlock all stages sequentially', () => {
    render(<Timeline data={MOCK_TIMELINE_DATA} />);
    // Unlock stage 2
    fireEvent.click(screen.getByText(/Explore Next Stage/));
    // Unlock stage 3
    fireEvent.click(screen.getByText(/Explore Next Stage/));
    // Should now show stage 3 details — final stage, no "Explore Next Stage"
    expect(screen.getByText('Candidates file nominations.')).toBeInTheDocument();
    expect(screen.getByText(/3 \/ 3 Stages Explored/)).toBeInTheDocument();
  });

  it('should not show "Explore Next Stage" on the last stage', () => {
    render(<Timeline data={MOCK_TIMELINE_DATA} />);
    fireEvent.click(screen.getByText(/Explore Next Stage/));
    fireEvent.click(screen.getByText(/Explore Next Stage/));
    // On the final stage — no unlock button
    expect(screen.queryByText(/Explore Next Stage/)).toBeNull();
  });
});
