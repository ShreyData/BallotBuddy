import { renderHook, waitFor } from '@testing-library/react'
import { useTimeline } from '../hooks/useTimeline'
import { apiService } from '../services/api'

// Mock the apiService
jest.mock('../services/api', () => ({
  apiService: {
    getTimeline: jest.fn(),
    loginGuest: jest.fn(),
  },
}))

describe('useTimeline', () => {
  it('fetches and returns timeline data', async () => {
    const mockEvents = [
      { phase: 'Registration', description: 'Register to vote' },
      { phase: 'Voting', description: 'Cast your ballot' },
    ]
    ;(apiService.getTimeline as jest.Mock).mockResolvedValue({ events: mockEvents })
    ;(apiService.loginGuest as jest.Mock).mockResolvedValue({ access_token: 'test-token' })

    const { result } = renderHook(() => useTimeline())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.timeline).toEqual(mockEvents)
    expect(result.current.error).toBe(null)
  })

  it('handles errors during fetching', async () => {
    ;(apiService.getTimeline as jest.Mock).mockRejectedValue(new Error('Network Error'))
    ;(apiService.loginGuest as jest.Mock).mockResolvedValue({ access_token: 'test-token' })

    const { result } = renderHook(() => useTimeline())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toBe('Network Error')
    expect(result.current.timeline).toEqual([])
  })
})
