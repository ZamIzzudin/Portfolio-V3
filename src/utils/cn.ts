/**
 * Lightweight className combiner.
 * Filters falsy values and joins the rest with a space.
 * Replace with `clsx` or `tailwind-merge` if you need more power.
 */
export type ClassValue = string | number | null | false | undefined

export function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(' ')
}
