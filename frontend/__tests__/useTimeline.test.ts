import { renderHook, waitFor } from '@testing-library/react'
import { useTimeline } from '../hooks/useTimeline'
import { apiService } from '../services/api'

jest.mock('../services/api', () => ({
  apiService: {
    getTimeline: jest.fn(),
  },
}))

describe('useTimeline', () => {
  it('fetches and returns timeline data', async () => {
    const mockTimeline = { events: [{ phase: 'Phase 1', description: 'Desc 1' }] }
    ;(apiService.getTimeline as jest.Mock).mockResolvedValue(mockTimeline)

    const { result } = renderHook(() => useTimeline())

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.timeline).toEqual(mockTimeline.events)
      expect(result.current.isLoading).toBe(false)
    })
  })

  it('handles errors during fetching', async () => {
    ;(apiService.getTimeline as jest.Mock).mockRejectedValue(new Error('Fetch failed'))

    const { result } = renderHook(() => useTimeline())

    await waitFor(() => {
      expect(result.current.error).toBe('Fetch failed')
      expect(result.current.isLoading).toBe(false)
    })
  })
})
