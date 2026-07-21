<script setup lang="ts">
import { ref, computed } from 'vue'

type Difficulty = 'easy' | 'medium' | 'hard'

interface AdaptiveQuestion {
  text: string
  options: string[]
  correct: number
}

const POOLS: Record<Difficulty, AdaptiveQuestion[]> = {
  easy: [
    {
      text: "What is the past tense of the verb 'go'?",
      options: ['goed', 'went', 'going', 'gone'],
      correct: 1,
    },
    {
      text: "Which word completes the sentence: 'She _____ to the store yesterday.'",
      options: ['go', 'goes', 'went', 'gone'],
      correct: 2,
    },
    {
      text: 'Choose the correct spelling:',
      options: ['beleive', 'belive', 'believe', 'beliieve'],
      correct: 2,
    },
  ],
  medium: [
    {
      text: 'If I _____ more time, I would learn another language.',
      options: ['have', 'had', 'would have', 'will have'],
      correct: 1,
    },
    {
      text: 'The scientist, _____ research was groundbreaking, received the Nobel Prize.',
      options: ['who', 'whose', 'which', 'that'],
      correct: 1,
    },
    {
      text: 'Despite _____ tired, she finished the assignment.',
      options: ['being', 'to be', 'she was', 'she is'],
      correct: 0,
    },
  ],
  hard: [
    {
      text: 'Which sentence uses the subjunctive mood correctly?',
      options: [
        'If I was you, I would accept the offer.',
        'If I were you, I would accept the offer.',
        'If I am you, I would accept the offer.',
        'If I be you, I would accept the offer.',
      ],
      correct: 1,
    },
    {
      text: 'The committee _____ agreed to postpone the meeting.',
      options: ['have', 'has', 'are having', 'is having'],
      correct: 1,
    },
    {
      text: 'Choose the sentence with correct parallel structure:',
      options: [
        'She likes reading, to swim, and cooking.',
        'She likes reading, swimming, and cooking.',
        'She likes to read, swimming, and cook.',
        'She likes reading, to swim, and cooking.',
      ],
      correct: 1,
    },
  ],
}

const TOTAL_QUESTIONS = 5
const currentDifficulty = ref<Difficulty>('easy')
const currentQIndex = ref(0)
const score = ref(0)
const answered = ref(false)
const selectedIdx = ref<number | null>(null)
const isCorrect = ref(false)
const difficultyPath = ref<Difficulty[]>([])
const nextDifficulty = ref<Difficulty | null>(null)

const currentQ = computed(() => {
  const pool = POOLS[currentDifficulty.value]
  return pool[currentQIndex.value % pool.length]
})

const qCounter = computed(
  () => `Question ${Math.min(currentQIndex.value + 1, TOTAL_QUESTIONS)} of ${TOTAL_QUESTIONS}`,
)

const progressPct = computed(() =>
  Math.min((currentQIndex.value / TOTAL_QUESTIONS) * 100, 100),
)

function selectAnswer(idx: number) {
  if (answered.value) return
  answered.value = true
  selectedIdx.value = idx
  isCorrect.value = idx === currentQ.value.correct

  if (isCorrect.value) {
    score.value++
    if (currentDifficulty.value === 'easy') nextDifficulty.value = 'medium'
    else if (currentDifficulty.value === 'medium') nextDifficulty.value = 'hard'
    else nextDifficulty.value = 'hard'
  } else {
    if (currentDifficulty.value === 'hard') nextDifficulty.value = 'medium'
    else if (currentDifficulty.value === 'medium') nextDifficulty.value = 'easy'
    else nextDifficulty.value = 'easy'
  }
}

function nextQuestion() {
  if (nextDifficulty.value) {
    currentDifficulty.value = nextDifficulty.value
    difficultyPath.value.push(nextDifficulty.value)
    nextDifficulty.value = null
  }
  currentQIndex.value++
  answered.value = false
  selectedIdx.value = null
}

const isFinished = computed(() => currentQIndex.value >= TOTAL_QUESTIONS - 1 && answered.value)

function reset() {
  currentDifficulty.value = 'easy'
  currentQIndex.value = 0
  score.value = 0
  answered.value = false
  selectedIdx.value = null
  difficultyPath.value = []
  nextDifficulty.value = null
}
</script>

<template>
  <div class="adaptive-demo">
    <div class="demo-header">
      <span class="badge-tag">Adaptive Quiz</span>
      <span class="difficulty-badge" :class="currentDifficulty">
        {{ currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1) }}
      </span>
    </div>

    <div class="progress-row">
      <span>{{ qCounter }}</span>
      <span>Score: {{ score }}</span>
    </div>
    <div class="progress-bar-bg">
      <div class="progress-bar-fill" :style="{ width: progressPct + '%' }"></div>
    </div>

    <div v-if="!isFinished" class="quiz-area">
      <p class="question-text">{{ currentQ.text }}</p>

      <div class="options">
        <button v-for="(opt, idx) in currentQ.options" :key="idx" class="option" :class="{
          correct: answered && idx === currentQ.correct,
          wrong: answered && idx === selectedIdx && idx !== currentQ.correct,
          dimmed: answered && idx !== currentQ.correct && idx !== selectedIdx,
        }" :disabled="answered" @click="selectAnswer(idx)">
          <span class="radio" :class="{
            correct: answered && idx === currentQ.correct,
            wrong: answered && idx === selectedIdx && idx !== currentQ.correct,
          }"></span>
          <span>{{ String.fromCharCode(65 + idx) }}. {{ opt }}</span>
        </button>
      </div>

      <div v-if="answered" class="feedback" :class="{ correct: isCorrect, wrong: !isCorrect }">
        {{
          isCorrect
            ? 'Correct! Difficulty will increase for the next question.'
            : 'Incorrect. Difficulty will decrease to help you build confidence.'
        }}
      </div>

      <button v-if="answered && !isFinished" class="next-btn" @click="nextQuestion">
        Next Question &rarr;
      </button>
    </div>

    <div v-else class="final-screen">
      <div class="final-label">Final Score</div>
      <div class="final-score">{{ score }}/{{ TOTAL_QUESTIONS }}</div>
      <div class="difficulty-path">
        <strong>Difficulty Path:</strong><br />
        <span v-for="(d, i) in difficultyPath" :key="i" class="path-dot" :class="d"></span>
        <span class="path-legend">
          <span class="path-dot easy"></span> Easy
          <span class="path-dot medium"></span> Medium
          <span class="path-dot hard"></span> Hard
        </span>
      </div>
      <button class="reset-btn" @click="reset">Try Again</button>
    </div>
  </div>
</template>

<style scoped>
.adaptive-demo {
  background: var(--color-surface);
  border: 1px solid var(--brand-color);
  border-radius: var(--radius-lg);
  padding: 2.8rem;
}

.demo-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.6rem;
}

.badge-tag {
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--brand-color);
}

.difficulty-badge {
  font-size: 1.2rem;
  font-weight: 600;
  padding: 0.4rem 1rem;
  border-radius: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.difficulty-badge.easy {
  background: #e6faf2;
  color: #1daf6a;
}

.difficulty-badge.medium {
  background: #fef3c7;
  color: #92400e;
}

.difficulty-badge.hard {
  background: #ef4444;
  color: white;
}

.progress-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
  font-size: 1.2rem;
  color: var(--color-tertiary);
}

.progress-bar-bg {
  height: 0.6rem;
  background: var(--color-muted);
  border-radius: 0.3rem;
  overflow: hidden;
  margin-bottom: 1.8rem;
}

.progress-bar-fill {
  height: 100%;
  background: var(--brand-color);
  border-radius: 0.3rem;
  transition: width 0.3s;
}

.question-text {
  font-size: 1.5rem;
  line-height: 1.7;
  color: var(--color-primary);
  margin-bottom: 1.8rem;
  font-weight: 500;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.option {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--color-surface);
  border: 1px solid var(--color-divider);
  border-radius: 1rem;
  padding: 1.2rem 1.6rem;
  font-size: 1.4rem;
  cursor: pointer;
  transition: all 0.15s;
  font-family: var(--font-sans);
  text-align: left;
  color: var(--color-secondary);
}

.option:hover:not(:disabled) {
  border-color: var(--brand-color);
  background: var(--hover-fill);
}

.option.correct {
  border-color: #3dd68c;
  background: #e6faf2;
  color: #1daf6a;
}

.option.wrong {
  border-color: #ef4444;
  background: #fef2f2;
  color: #b91c1c;
}

.option:disabled {
  cursor: default;
}

.option.dimmed {
  opacity: 0.55;
}

.radio {
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 50%;
  border: 2px solid var(--color-tertiary);
  flex-shrink: 0;
  transition: all 0.2s;
}

.radio.correct {
  border-color: #3dd68c;
  background: #3dd68c;
}

.radio.wrong {
  border-color: #ef4444;
  background: #ef4444;
}

.feedback {
  margin-top: 1.6rem;
  padding: 1.2rem 1.6rem;
  border-radius: 1rem;
  font-size: 1.3rem;
  line-height: 1.55;
}

.feedback.correct {
  background: #e6faf2;
  color: #1daf6a;
}

.feedback.wrong {
  background: #fef2f2;
  color: #b91c1c;
}

.next-btn {
  margin-top: 1.4rem;
  background: var(--brand-color);
  color: white;
  border: none;
  padding: 1.2rem 2rem;
  border-radius: 1rem;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  font-family: var(--font-sans);
  width: 100%;
  transition: opacity 0.15s;
}

.next-btn:hover {
  opacity: 0.88;
}

.final-screen {
  text-align: center;
  padding: 2rem 0;
}

.final-label {
  font-size: 1.3rem;
  color: var(--color-tertiary);
  margin-bottom: 0.4rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.final-score {
  font-size: 4.8rem;
  font-weight: 800;
  color: var(--brand-color);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.difficulty-path {
  margin-top: 1.8rem;
  padding: 1.2rem;
  background: var(--color-muted);
  border-radius: 0.8rem;
  font-size: 1.3rem;
  line-height: 1.6;
}

.path-dot {
  display: inline-block;
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  margin: 0 0.4rem;
}

.path-dot.easy {
  background: #3dd68c;
}

.path-dot.medium {
  background: #f59e0b;
}

.path-dot.hard {
  background: #ef4444;
}

.path-legend {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-left: 1rem;
  font-size: 1.1rem;
  color: var(--color-tertiary);
}

.reset-btn {
  margin-top: 1.6rem;
  background: var(--color-surface);
  color: var(--color-secondary);
  border: 1px solid var(--color-divider);
  padding: 1rem;
  border-radius: 1rem;
  font-size: 1.4rem;
  font-weight: 500;
  cursor: pointer;
  font-family: var(--font-sans);
  width: 100%;
  transition: background 0.15s;
}

.reset-btn:hover {
  background: var(--hover-fill);
}
</style>
