'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, RefreshCcw, Info, ArrowRight, Award, Zap, Shield, Flag, Trophy, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import styles from './Quiz.module.css';

const REACTIONS = {
  correct: ['🌟', '🔥', '🚀', '🎯', '🙌'],
  incorrect: ['🤔', '📚', '💪', '✨']
};

/**
 * ElectionQuiz Component
 * 
 * An interactive quiz application that tests user knowledge of election procedures.
 * Supports multiple rounds, score tracking, animated reactions, and a final result summary.
 * 
 * @param {Object} props - Component properties
 * @param {Array} props.data - Quiz data organized into rounds and questions
 * @returns {JSX.Element|null} The rendered Quiz component or null if no data
 */
export default function ElectionQuiz({ data }) {
  const rounds = data || []; // Expected quiz_rounds array
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isIntroing, setIsIntroing] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [reactionIndex, setReactionIndex] = useState(0);
  const reactionCounter = useRef(0);

  const currentRound = rounds[currentRoundIdx];
  const currentQuestion = currentRound?.questions?.[currentQuestionIdx];
  const totalQuestions = rounds.reduce((acc, r) => acc + r.questions.length, 0);

  useEffect(() => {
    if (isIntroing) {
      const timer = setTimeout(() => setIsIntroing(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [currentRoundIdx, isIntroing]);

  const triggerConfetti = (type) => {
    if (type === 'success') {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 }, colors: ['#FF9933', '#FFFFFF', '#128807'] });
    }
  };

  const handleOptionClick = (option) => {
    if (selectedOption !== null) return;
    const correct = option === currentQuestion.answer;
    setSelectedOption(option);
    setIsCorrect(correct);
    reactionCounter.current += 1;
    setReactionIndex(reactionCounter.current % REACTIONS.correct.length);
    if (correct) {
      setScore(score + 1);
      triggerConfetti('success');
    }
  };

  const nextStep = () => {
    if (currentQuestionIdx + 1 < currentRound.questions.length) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else if (currentRoundIdx + 1 < rounds.length) {
      setCurrentRoundIdx(currentRoundIdx + 1);
      setCurrentQuestionIdx(0);
      setSelectedOption(null);
      setIsCorrect(null);
      setIsIntroing(true);
    } else {
      setShowResult(true);
    }
  };

  const getRank = () => {
    const ratio = score / totalQuestions;
    if (ratio === 1) return "Sovereign Master";
    if (ratio >= 0.7) return "Democratic Leader";
    return "Civic Scholar";
  };

  const restartQuiz = () => window.location.reload();

  if (!rounds || rounds.length === 0) return <div>No quiz available</div>;

  if (isIntroing && !showResult) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        className={styles.introOverlay}
      >
        <div className={styles.introContent}>
          <div className={styles.roundIcon}>
            {currentRoundIdx === 0 ? <Zap size={48} /> : currentRoundIdx === 1 ? <Shield size={48} /> : <Flag size={48} />}
          </div>
          <h2 className={styles.roundTitle}>{currentRound.name}</h2>
          <p className={styles.roundDesc}>{currentRound.description}</p>
          <div className={styles.loadingBar}><motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2.5 }} className={styles.loadingFill} /></div>
        </div>
      </motion.div>
    );
  }

  if (showResult) {
    return (
      <div className={styles.resultContainer}>
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={`${styles.resultCard} glass`}>
          <Trophy size={64} className={styles.finalTrophy} />
          <h2>Quest Complete!</h2>
          <div className={styles.finalRank}>{getRank()}</div>
          <div className={styles.scoreRow}>
            <span>Accuracy Score</span>
            <strong>{Math.round((score / totalQuestions) * 100)}%</strong>
          </div>
          <div className={styles.statGrid}>
            <div className={styles.miniStat}><span>Correct</span><strong>{score}</strong></div>
            <div className={styles.miniStat}><span>Questions</span><strong>{totalQuestions}</strong></div>
            <div className={styles.miniStat}><span>Rounds</span><strong>{rounds.length}</strong></div>
          </div>
          <button onClick={restartQuiz} className={styles.restartBtn}>
            <RefreshCcw size={18} /> New Quest
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.quizGame}>
      <div className={styles.gameHeader}>
        <div className={styles.roundCounter}>Round {currentRoundIdx + 1} of {rounds.length}</div>
        <div className={styles.stepDots}>
          {currentRound.questions.map((_, i) => (
            <div key={i} className={`${styles.dot} ${i === currentQuestionIdx ? styles.dotActive : i < currentQuestionIdx ? styles.dotDone : ''}`} />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentRoundIdx + '-' + currentQuestionIdx}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          className={styles.questionCard}
        >
          <h3 className={styles.qText}>{currentQuestion.question}</h3>
          
          <div className={styles.optionsStack}>
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isAnswer = opt === currentQuestion.answer;
              let state = '';
              if (selectedOption) {
                if (isAnswer) state = styles.correct;
                else if (isSelected) state = styles.incorrect;
                else state = styles.faded;
              }

              return (
                <button
                  key={idx}
                  disabled={!!selectedOption}
                  onClick={() => handleOptionClick(opt)}
                  className={`${styles.optItem} ${state}`}
                >
                  <span className={styles.optKey}>{String.fromCharCode(65 + idx)}</span>
                  <span className={styles.optVal}>{opt}</span>
                  {selectedOption && isAnswer && <CheckCircle2 size={16} className={styles.checkIcon} />}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {selectedOption && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className={styles.explanationBox}>
                <div className={styles.expHeader}>
                   <div className={styles.reactionIcon}>{isCorrect ? REACTIONS.correct[reactionIndex] : REACTIONS.incorrect[reactionIndex]}</div>
                   <strong>{isCorrect ? 'Correct!' : 'Not Quite!'}</strong>
                </div>
                <p>{currentQuestion.explanation}</p>
                <button className={styles.nextBtn} onClick={nextStep}>
                  {currentQuestionIdx + 1 === currentRound.questions.length && currentRoundIdx + 1 === rounds.length ? 'Finish Quest' : 'Continue'} <ArrowRight size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
