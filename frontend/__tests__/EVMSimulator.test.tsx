import { render, screen, fireEvent, act } from '@testing-library/react'
import EVMSimulator from '../components/EVMSimulator'

describe('EVMSimulator', () => {
  it('renders intro state initially', () => {
    render(<EVMSimulator />)
    expect(screen.getByText('Interactive EVM Practice')).toBeInTheDocument()
    expect(screen.getByText('Start Practice Demo')).toBeInTheDocument()
  })

  it('transitions to voting state when start is clicked', async () => {
    render(<EVMSimulator />)
    await act(async () => {
      fireEvent.click(screen.getByText('Start Practice Demo'))
    })
    
    // Use findByText to wait for animations
    expect(await screen.findByText('Ballot Unit')).toBeInTheDocument()
    expect(await screen.findByText('Candidate A')).toBeInTheDocument()
  })

  it('transitions to VVPAT state when a candidate is selected', async () => {
    render(<EVMSimulator />)
    await act(async () => {
      fireEvent.click(screen.getByText('Start Practice Demo'))
    })
    
    // Find the blue button for Candidate A
    const voteButtons = await screen.findAllByRole('button', { name: /Vote for/i })
    await act(async () => {
      fireEvent.click(voteButtons[0])
    })
    
    expect(await screen.findByText('VVPAT Verification')).toBeInTheDocument()
    expect(await screen.findByText('VVPAT SLIP • SECURE VOTE')).toBeInTheDocument()
  })
})
