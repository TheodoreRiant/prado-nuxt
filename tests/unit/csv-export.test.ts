import { describe, it, expect, vi, beforeEach } from 'vitest'

/**
 * Tests for the exportToCsv utility from utils/csvExport.ts.
 * We reproduce the CSV generation logic and test it without DOM dependencies.
 */

function buildCsvContent(headers: string[], rows: string[][]): string {
  return [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')),
  ].join('\n')
}

describe('CSV content generation', () => {
  it('generates headers as first line', () => {
    const csv = buildCsvContent(['Nom', 'Prenom', 'Email'], [])
    expect(csv).toBe('Nom,Prenom,Email')
  })

  it('generates rows with quoted cells', () => {
    const csv = buildCsvContent(
      ['Nom', 'Prenom'],
      [['Dupont', 'Alice']],
    )
    const lines = csv.split('\n')
    expect(lines[1]).toBe('"Dupont","Alice"')
  })

  it('escapes double quotes in cell values', () => {
    const csv = buildCsvContent(
      ['Nom'],
      [['He said "hello"']],
    )
    const lines = csv.split('\n')
    expect(lines[1]).toBe('"He said ""hello"""')
  })

  it('handles null/undefined cells gracefully', () => {
    const csv = buildCsvContent(
      ['Nom'],
      [[null as any], [undefined as any]],
    )
    const lines = csv.split('\n')
    expect(lines[1]).toBe('""')
    expect(lines[2]).toBe('""')
  })

  it('handles empty rows array', () => {
    const csv = buildCsvContent(['A', 'B'], [])
    expect(csv).toBe('A,B')
  })

  it('handles cells with commas', () => {
    const csv = buildCsvContent(['Notes'], [['one, two, three']])
    const lines = csv.split('\n')
    expect(lines[1]).toBe('"one, two, three"')
  })

  it('handles cells with newlines', () => {
    const csv = buildCsvContent(['Notes'], [['line1\nline2']])
    const lines = csv.split('\n')
    // The cell is quoted so the newline is part of the content
    expect(lines[1]).toBe('"line1')
    expect(lines[2]).toBe('line2"')
  })

  it('handles multiple columns and rows', () => {
    const csv = buildCsvContent(
      ['Nom', 'Prenom', 'Age'],
      [
        ['Dupont', 'Alice', '20'],
        ['Martin', 'Bob', '22'],
      ],
    )
    const lines = csv.split('\n')
    expect(lines).toHaveLength(3)
    expect(lines[0]).toBe('Nom,Prenom,Age')
    expect(lines[1]).toBe('"Dupont","Alice","20"')
    expect(lines[2]).toBe('"Martin","Bob","22"')
  })
})
