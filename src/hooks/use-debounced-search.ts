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

  // 1. Debounce input query (300ms default)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(inputQuery)
    }, debounceMs)

    return () => {
      clearTimeout(handler)
    }
  }, [inputQuery, debounceMs])

  const trimmed = debouncedQuery.trim()
  
  // 2. Minimum character check (block < 3 characters)
  const isTooShort = trimmed.length > 0 && trimmed.length < minChars
  const effectiveQuery = trimmed.length >= minChars ? trimmed : ''

  // 3. TanStack Query caching for search results
  const { data: filteredResults = [] } = useQuery({
    queryKey: [resourceKey, effectiveQuery, extraFilters],
    queryFn: () => {
      return filterFn(data, effectiveQuery, extraFilters)
    },
    staleTime: 5 * 60 * 1000, // 5 mins in memory cache
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
