import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

interface UseDebouncedSearchOptions<T> {
  resourceKey: string
  data: T[]
  filterFn: (items: T[], query: string, extraFilters?: any) => T[]
  extraFilters?: Record<string, any>
  debounceMs?: number
  minChars?: number
}

export function useDebouncedSearch<T>({
  resourceKey,
  data,
  filterFn,
  extraFilters = {},
  debounceMs = 300,
  minChars = 3,
}: UseDebouncedSearchOptions<T>) {
  const [inputQuery, setInputQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(inputQuery)
    }, debounceMs)

    return () => {
      clearTimeout(handler)
    }
  }, [inputQuery, debounceMs])

  const trimmed = debouncedQuery.trim()
  const isTooShort = trimmed.length > 0 && trimmed.length < minChars
  const effectiveQuery = trimmed.length >= minChars ? trimmed : ''

  const { data: filteredResults = [] } = useQuery({
    queryKey: [resourceKey, effectiveQuery, extraFilters],
    queryFn: () => {
      return filterFn(data, effectiveQuery, extraFilters)
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  return {
    inputQuery,
    setInputQuery,
    debouncedQuery: effectiveQuery,
    isTooShort,
    results: filteredResults,
    minChars,
  }
}
