/**
 * Tests for Context providers and data integrity
 * Covers: LanguageContext, AssistantContext, election data structure
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';
import { AssistantProvider, useAssistant } from '@/context/AssistantContext';
import electionData from '@/data/india-election.json';

// --- LanguageContext Tests ---
function LanguageTestConsumer() {
  const { lang, setLang } = useLanguage();
  return (
    <div>
      <span data-testid="lang">{lang}</span>
      <button onClick={() => setLang('hi')}>Switch to Hindi</button>
      <button onClick={() => setLang('en')}>Switch to English</button>
    </div>
  );
}

describe('LanguageContext', () => {
  it('should default to English', () => {
    render(
      <LanguageProvider>
        <LanguageTestConsumer />
      </LanguageProvider>
    );
    expect(screen.getByTestId('lang').textContent).toBe('en');
  });

  it('should switch language to Hindi', () => {
    render(
      <LanguageProvider>
        <LanguageTestConsumer />
      </LanguageProvider>
    );
    fireEvent.click(screen.getByText('Switch to Hindi'));
    expect(screen.getByTestId('lang').textContent).toBe('hi');
  });

  it('should switch back to English', () => {
    render(
      <LanguageProvider>
        <LanguageTestConsumer />
      </LanguageProvider>
    );
    fireEvent.click(screen.getByText('Switch to Hindi'));
    fireEvent.click(screen.getByText('Switch to English'));
    expect(screen.getByTestId('lang').textContent).toBe('en');
  });
});

// --- AssistantContext Tests ---
function AssistantTestConsumer() {
  const { isOpen, openAssistant, closeAssistant, toggleAssistant } = useAssistant();
  return (
    <div>
      <span data-testid="isOpen">{isOpen ? 'open' : 'closed'}</span>
      <button onClick={openAssistant}>Open</button>
      <button onClick={closeAssistant}>Close</button>
      <button onClick={toggleAssistant}>Toggle</button>
    </div>
  );
}

describe('AssistantContext', () => {
  it('should default to closed', () => {
    render(
      <AssistantProvider>
        <AssistantTestConsumer />
      </AssistantProvider>
    );
    expect(screen.getByTestId('isOpen').textContent).toBe('closed');
  });

  it('should open the assistant', () => {
    render(
      <AssistantProvider>
        <AssistantTestConsumer />
      </AssistantProvider>
    );
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByTestId('isOpen').textContent).toBe('open');
  });

  it('should close the assistant', () => {
    render(
      <AssistantProvider>
        <AssistantTestConsumer />
      </AssistantProvider>
    );
    fireEvent.click(screen.getByText('Open'));
    fireEvent.click(screen.getByText('Close'));
    expect(screen.getByTestId('isOpen').textContent).toBe('closed');
  });

  it('should toggle the assistant state', () => {
    render(
      <AssistantProvider>
        <AssistantTestConsumer />
      </AssistantProvider>
    );
    fireEvent.click(screen.getByText('Toggle'));
    expect(screen.getByTestId('isOpen').textContent).toBe('open');
    fireEvent.click(screen.getByText('Toggle'));
    expect(screen.getByTestId('isOpen').textContent).toBe('closed');
  });

  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<AssistantTestConsumer />)).toThrow(
      'useAssistant must be used within AssistantProvider'
    );
    consoleSpy.mockRestore();
  });
});

// --- Election Data Integrity Tests ---
describe('Election Data (india-election.json)', () => {
  describe('English locale', () => {
    const en = electionData.en;

    it('should have all required top-level keys', () => {
      expect(en).toHaveProperty('timeline');
      expect(en).toHaveProperty('explainers');
      expect(en).toHaveProperty('quiz_rounds');
      expect(en).toHaveProperty('sidebar');
      expect(en).toHaveProperty('fact');
    });

    it('should have at least 3 timeline stages', () => {
      expect(en.timeline.length).toBeGreaterThanOrEqual(3);
    });

    it('should have valid timeline structure', () => {
      en.timeline.forEach((stage) => {
        expect(stage).toHaveProperty('stage');
        expect(stage).toHaveProperty('description');
        expect(stage).toHaveProperty('color');
        expect(stage).toHaveProperty('tasks');
        expect(Array.isArray(stage.tasks)).toBe(true);
        expect(stage.tasks.length).toBeGreaterThan(0);
      });
    });

    it('should have quiz rounds with valid question structure', () => {
      expect(en.quiz_rounds.length).toBeGreaterThanOrEqual(1);
      en.quiz_rounds.forEach((round) => {
        expect(round).toHaveProperty('name');
        expect(round).toHaveProperty('questions');
        round.questions.forEach((q) => {
          expect(q).toHaveProperty('question');
          expect(q).toHaveProperty('options');
          expect(q).toHaveProperty('answer');
          expect(q).toHaveProperty('explanation');
          expect(q.options.length).toBeGreaterThanOrEqual(2);
          // Answer must be one of the options
          expect(q.options).toContain(q.answer);
        });
      });
    });

    it('should have explainers with content', () => {
      expect(en.explainers.length).toBeGreaterThanOrEqual(1);
      en.explainers.forEach((exp) => {
        expect(exp).toHaveProperty('title');
        expect(exp).toHaveProperty('content');
        expect(exp.content.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Hindi locale', () => {
    const hi = electionData.hi;

    it('should exist with required keys', () => {
      expect(hi).toHaveProperty('timeline');
      expect(hi).toHaveProperty('explainers');
      expect(hi).toHaveProperty('quiz_rounds');
      expect(hi).toHaveProperty('sidebar');
    });

    it('should have quiz answers matching options', () => {
      hi.quiz_rounds.forEach((round) => {
        round.questions.forEach((q) => {
          expect(q.options).toContain(q.answer);
        });
      });
    });
  });
});
