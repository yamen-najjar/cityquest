// Kept apart from dictionary.ts, which imports every language's texts: a client component that only needs
// fmt() then ships none of them (they reach the page as props instead).

/** "{n} of {total}" with { n: 2, total: 5 } -> "2 of 5". Unknown placeholders are left as they are. */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
}
