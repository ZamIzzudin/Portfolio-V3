<script setup lang="ts">
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'plain' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant
    size?: ButtonSize
    label: string
    action?: () => void
    icon?: string
    rounded?: boolean
  }>(),
  { variant: 'primary', size: 'md', rounded: true },
)

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  plain: 'btn-plain',
  outline: 'btn-outline',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
}
</script>

<template>
  <button
    :class="['btn-base', variantClasses[props.variant], sizeClasses[props.size], rounded ? 'rounded-full!' : 'rounded-sm!']"
    @click="props.action?.()">
    {{ props.label }}
  </button>
</template>