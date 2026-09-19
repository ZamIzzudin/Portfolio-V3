<script setup lang="ts">
const inputs = [
  { id: 'whatsapp', label: 'Incoming WhatsApp', sub: 'message' },
  { id: 'scheduler', label: 'Scheduler', sub: 'daily cron jobs' },
]

const core = {
  label: 'Agent core',
  sub: 'LLM + tool-use loop',
}

const branches = [
  {
    id: 'memory',
    label: 'Memory & context',
    sub: 'MongoDB + embeddings',
  },
  {
    id: 'tools',
    label: 'Tools',
    sub: 'search, schedule, custom',
  },
]

const output = {
  label: 'Reply / proactive message',
  sub: 'sent back to WhatsApp',
}
</script>

<template>
  <div class="flow" role="img" aria-label="NicheU agent workflow diagram">
    <!-- Inputs -->
    <div class="flow-row flow-inputs">
      <div v-for="item in inputs" :key="item.id" class="node node-input">
        <p class="node-label">{{ item.label }}</p>
        <p class="node-sub">{{ item.sub }}</p>
      </div>
    </div>

    <div class="connectors connectors-from-inputs">
      <div class="line line-down from-left" />
      <div class="line line-down from-right" />
      <div class="line line-merge" />
      <div class="line line-down to-core" />
    </div>

    <!-- Agent core -->
    <div class="flow-row">
      <div class="node node-core">
        <p class="node-label">{{ core.label }}</p>
        <p class="node-sub">{{ core.sub }}</p>
      </div>
    </div>

    <div class="connectors connectors-from-core">
      <div class="line line-down from-center" />
      <div class="line line-split" />
      <div class="line line-down to-left" />
      <div class="line line-down to-right" />
    </div>

    <!-- Branches -->
    <div class="flow-row flow-branches">
      <div v-for="item in branches" :key="item.id" class="node node-branch">
        <p class="node-label">{{ item.label }}</p>
        <p class="node-sub">{{ item.sub }}</p>
      </div>
    </div>

    <div class="connectors connectors-to-output">
      <div class="line line-down from-left" />
      <div class="line line-down from-right" />
      <div class="line line-merge" />
      <div class="line line-down to-core" />
    </div>

    <!-- Output -->
    <div class="flow-row">
      <div class="node node-output">
        <p class="node-label">{{ output.label }}</p>
        <p class="node-sub">{{ output.sub }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.flow {
  width: 100%;
  max-width: 64rem;
  margin: 0 auto;
  padding: 2.4rem 1.2rem 1.2rem;
  border: 1px solid var(--color-divider);
  border-radius: 1.6rem;
  background: color-mix(in srgb, var(--color-hero-bg) 65%, transparent);
  overflow-x: auto;
}

.flow-row {
  display: flex;
  justify-content: center;
  gap: 2.4rem;
  flex-wrap: wrap;
}

.flow-inputs,
.flow-branches {
  gap: clamp(1.6rem, 4vw, 4.8rem);
}

.node {
  min-width: min(100%, 18rem);
  max-width: 24rem;
  flex: 1 1 16rem;
  border: 1px solid var(--color-divider);
  border-radius: 1.2rem;
  padding: 1.6rem 1.8rem;
  background: var(--color-surface, #fff);
  text-align: center;
  box-shadow: 0 1px 0 color-mix(in srgb, var(--color-primary) 6%, transparent);
}

:global(.dark) .node,
:global([data-theme='dark']) .node {
  background: color-mix(in srgb, var(--color-primary) 6%, transparent);
}

.node-core {
  max-width: 28rem;
  border-color: color-mix(in srgb, var(--brand-color) 45%, var(--color-divider));
  background: color-mix(in srgb, var(--brand-color) 10%, transparent);
}

.node-output {
  max-width: 36rem;
  border-color: color-mix(in srgb, var(--brand-color) 35%, var(--color-divider));
}

.node-label {
  margin: 0;
  font-size: clamp(1.25rem, 2vw, 1.45rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--color-primary);
  line-height: 1.35;
}

.node-core .node-label,
.node-output .node-label {
  color: var(--brand-color);
}

.node-sub {
  margin: 0.55rem 0 0;
  font-size: clamp(1.05rem, 1.6vw, 1.25rem);
  line-height: 1.45;
  color: var(--color-secondary);
}

.connectors {
  position: relative;
  height: 4.8rem;
  width: min(100%, 42rem);
  margin: 0 auto;
}

.line {
  position: absolute;
  background: color-mix(in srgb, var(--brand-color) 55%, var(--color-divider));
}

.line-down {
  width: 2px;
  height: 2rem;
  top: 0;
}

.connectors-from-inputs .from-left,
.connectors-to-output .from-left {
  left: calc(25% - 1px);
}

.connectors-from-inputs .from-right,
.connectors-to-output .from-right {
  left: calc(75% - 1px);
}

.connectors-from-inputs .line-merge,
.connectors-to-output .line-merge {
  height: 2px;
  width: 50%;
  left: 25%;
  top: 2rem;
}

.connectors-from-inputs .to-core,
.connectors-to-output .to-core {
  left: calc(50% - 1px);
  top: 2rem;
  height: 2.8rem;
}

.connectors-from-core .from-center {
  left: calc(50% - 1px);
  height: 2rem;
}

.connectors-from-core .line-split {
  height: 2px;
  width: 50%;
  left: 25%;
  top: 2rem;
}

.connectors-from-core .to-left {
  left: calc(25% - 1px);
  top: 2rem;
  height: 2.8rem;
}

.connectors-from-core .to-right {
  left: calc(75% - 1px);
  top: 2rem;
  height: 2.8rem;
}

@media (max-width: 639px) {
  .connectors {
    display: none;
  }

  .flow-row {
    flex-direction: column;
    align-items: stretch;
  }

  .node {
    max-width: none;
  }

  .flow-row + .flow-row,
  .connectors + .flow-row {
    margin-top: 1.2rem;
    position: relative;
  }

  .flow-row + .flow-row::before,
  .connectors + .flow-row::before {
    content: '';
    display: block;
    width: 2px;
    height: 1.2rem;
    margin: 0 auto 1.2rem;
    background: color-mix(in srgb, var(--brand-color) 55%, var(--color-divider));
  }

  .flow-inputs::before {
    display: none;
  }
}
</style>
