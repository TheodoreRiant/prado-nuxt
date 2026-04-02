import type { HTMLRichTextMapSerializer } from '@prismicio/client'

export const richTextSerializer: HTMLRichTextMapSerializer = {
  label: ({ node, children }) => {
    const classMap: Record<string, string> = {
      'highlight-pink': 'text-prado-sage',
      'highlight-orange': 'text-prado-sage',
      'highlight-purple': 'text-prado-teal',
      'highlight-green': 'text-prado-sage',
    }
    const cls = classMap[node.data.label ?? ''] ?? ''
    return `<span class="${cls}">${children}</span>`
  },
}
