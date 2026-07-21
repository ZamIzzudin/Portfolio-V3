<script setup lang="ts">
import { ref, computed } from 'vue'

interface Question {
  before: string
  after: string
  options: { id: string; text: string; correct: boolean }[]
  correctExplain: string
  wrongExplain: string
}

const QUESTIONS: Question[] = [
  {
    before: 'The scientist',
    after: 'the data carefully before publishing the results.',
    options: [
      { id: 'A', text: 'analyze', correct: false },
      { id: 'B', text: 'analyzing', correct: false },
      { id: 'C', text: 'analyzes', correct: false },
      { id: 'D', text: 'analyzed', correct: true },
    ],
    correctExplain:
      "Past tense 'analyzed' is appropriate - the action was completed before publishing.",
    wrongExplain:
      "Not quite. The analysis was completed before publishing, so past tense 'analyzed' is needed.",
  },
  {
    before: 'By the time we arrived at the station, the train',
    after: 'already.',
    options: [
      { id: 'A', text: 'left', correct: false },
      { id: 'B', text: 'had left', correct: true },
      { id: 'C', text: 'has left', correct: false },
      { id: 'D', text: 'was leaving', correct: false },
    ],
    correctExplain:
      "Past perfect 'had left' shows the action happened before another past event (arrival).",
    wrongExplain:
      "Think about sequence: the train's departure happened BEFORE you arrived - use past perfect 'had left'.",
  },
  {
    before: 'If I',
    after: 'more time, I would learn another language.',
    options: [
      { id: 'A', text: 'had', correct: true },
      { id: 'B', text: 'have', correct: false },
      { id: 'C', text: 'would have', correct: false },
      { id: 'D', text: 'will have', correct: false },
    ],
    correctExplain:
      "Second conditional uses 'if + past simple' for hypothetical present/future situations.",
    wrongExplain:
      "This is a second conditional (hypothetical). The 'if' clause needs past simple: 'If I had...'",
  },
]

const currentIdx = ref(0)
const score = ref(0)
const answered = ref(false)
const selectedOpt = ref<{ id: string; text: string; correct: boolean } | null>(null)
const isCorrect = ref(false)
const isFinished = ref(false)

const currentQ = computed(() => QUESTIONS[currentIdx.value])
const qCounter = computed(() => `Question ${currentIdx.value + 1} of ${QUESTIONS.length}`)
const finalPct = computed(() =>
  isFinished.value ? Math.round((score.value / QUESTIONS.length) * 100) : 0,
)

function selectOption(opt: (typeof QUESTIONS)[0]['options'][number]) {
  if (answered.value) return
  answered.value = true
  selectedOpt.value = opt
  isCorrect.value = opt.correct
  if (opt.correct) score.value++
  if (currentIdx.value >= QUESTIONS.length - 1) isFinished.value = true
}

function nextQuestion() {
  currentIdx.value++
  answered.value = false
  selectedOpt.value = null
}

function reset() {
  currentIdx.value = 0
  score.value = 0
  answered.value = false
  selectedOpt.value = null
  isFinished.value = false
}
</script>

<template>
  <div class="grammar-demo">
    <div class="demo-header">
      <span class="badge-tag">Fill in the Blank</span>
      <span class="pill">{{ qCounter }}</span>
    </div>

    <p class="question">
      {{ currentQ.before }}
      <span class="blank" :class="{ correct: answered && isCorrect, wrong: answered && !isCorrect }">
        {{ answered ? selectedOpt?.text : '_____' }}
      </span>
      {{ currentQ.after }}
    </p>

    <div class="options">
      <button v-for="opt in currentQ.options" :key="opt.id" class="option" :class="{
        'selected-correct': answered && opt === selectedOpt && isCorrect,
        'selected-wrong': answered && opt === selectedOpt && !isCorrect,
        dimmed: answered && opt !== selectedOpt,
      }" :disabled="answered" @click="selectOption(opt)">
        <span class="radio"
          :class="{ on: answered && opt === selectedOpt, correct: answered && opt === selectedOpt && isCorrect, wrong: answered && opt === selectedOpt && !isCorrect }"></span>
        <span><span class="opt-letter">{{ opt.id }}.</span>{{ opt.text }}</span>
      </button>
    </div>

    <div v-if="answered" class="feedback text-justify!" :class="{ correct: isCorrect, wrong: !isCorrect }">
      <strong>{{ isCorrect ? 'Correct!' : 'Opps!' }}</strong> {{ isCorrect ? currentQ.correctExplain :
        currentQ.wrongExplain }}
    </div>

    <div v-if="answered && !isFinished" class="action-row">
      <button class="next-q" @click="nextQuestion">Next Question &rarr;</button>
    </div>

    <div v-if="isFinished" class="final-result">
      <div class="font-semibold bg-[var(--brand-color)] text-xl text-white py-3 rounded-full">
        Final Result : {{ score }} / {{ QUESTIONS.length }}
      </div>
      <button class="reset-btn" v-if="finalPct < 100" @click="reset">Try Again</button>
    </div>
  </div>
</template>

<style scoped>
.grammar-demo {
  background: var(--color-surface);
  border: 1px solid var(--brand-color);
  border-radius: var(--radius-lg);
  padding: 2.8rem;
}

.demo-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.2rem;
}

.badge-tag {
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--brand-color);
}

.pill {
  background: color-mix(in srgb, var(--brand-color) 12%, transparent);
  color: var(--brand-color);
  font-size: 1.1rem;
  font-weight: 500;
  padding: 0.4rem 1rem;
  border-radius: 9999px;
}

.progress-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.6rem;
  font-size: 1.2rem;
  color: var(--color-tertiary);
}

.question {
  font-size: 1.4rem;
  line-height: 1.8;
  color: var(--color-primary);
  margin: 0 0 2rem;
}

.blank {
  display: inline-block;
  min-width: 5rem;
  padding: 0.2rem 1rem;
  border-radius: 0.6rem;
  text-align: center;
  font-weight: 600;
  background: var(--color-muted);
  color: var(--color-tertiary);
  transition: all 0.2s;
}

.blank.correct {
  background: #dcfce7;
  color: #047857;
}

.blank.wrong {
  background: #fee2e2;
  color: #b91c1c;
}

.options {
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr 1fr;
  flex-wrap: wrap;
  gap: 1rem;
}

.option {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  width: 100%;
  text-align: left;
  background: var(--color-surface);
  border: 1px solid var(--color-divider);
  border-radius: 1rem;
  padding: 1.2rem 1.6rem;
  font-size: 1.3rem;
  font-weight: 500;
  color: var(--color-secondary);
  cursor: pointer;
  transition: all 0.18s;
  font-family: var(--font-sans);
}

.option:hover:not(:disabled) {
  border-color: var(--brand-color);
  background: var(--hover-fill);
}

.option.selected-correct {
  border-color: #3dd68c;
  background: #e6faf2;
  color: #1f8154;
}

.option.selected-wrong {
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
  background: var(--color-surface);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.radio.on.correct {
  border-color: #3dd68c;
  background: #3dd68c;
}

.radio.on.wrong {
  border-color: #ef4444;
  background: #ef4444;
}

.radio.on:not(.correct):not(.wrong) {
  border-color: var(--brand-color);
  background: var(--brand-color);
}

.opt-letter {
  font-weight: 700;
  margin-right: 0.6rem;
}

.feedback {
  margin-top: 1.6rem;
  padding: 1.2rem 1.6rem;
  border-radius: 1rem;
  font-size: 1.3rem;
  line-height: 1.55;
}

.feedback.correct {
  background: var(--color-hero-bg);
  background: var(--brand-color-transparent);
}

.feedback.wrong {
  background: var(--color-hero-bg);
  background: var(--brand-color-transparent);
}

.action-row {
  margin-top: 1.4rem;
}

.next-q {
  width: 100%;
  background: var(--brand-color);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 1rem;
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  font-family: var(--font-sans);
  transition: opacity 0.15s;
}

.next-q:hover {
  opacity: 0.88;
}

.final-result {
  margin-top: 1.4rem;
  text-align: center;
}

.reset-btn {
  width: 100%;
  margin-top: 1rem;
  border: 1px solid var(--color-divider);
  background: var(--color-surface);
  padding: 1rem;
  border-radius: 1rem;
  font-size: 1.3rem;
  font-weight: 500;
  color: var(--color-secondary);
  cursor: pointer;
  font-family: var(--font-sans);
  transition: background 0.15s;
}

.reset-btn:hover {
  background: var(--hover-fill);
}
</style>
