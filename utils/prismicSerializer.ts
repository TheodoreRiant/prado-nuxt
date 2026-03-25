import type { HTMLRichTextMapSerializer } from '@prismicio/client'

export const richTextSerializer: HTMLRichTextMapSerializer = {
  label: ({ node, children }) => {
    const classMap: Record<string, string> = {
      'highlight-pink': 'text-[#CF006C]',
      'highlight-orange': 'text-[#FB6223]',
      'highlight-purple': 'text-[#C18ED8]',
      'highlight-green': 'text-[#93C1AF]',
    }
    const cls = classMap[node.data.label ?? ''] ?? ''
    return `<span class="${cls}">${children}</span>`
  },
}
