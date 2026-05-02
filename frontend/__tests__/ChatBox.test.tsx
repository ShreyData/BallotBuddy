import { render, screen, fireEvent } from '@testing-library/react'
import { ChatBox } from '../components/ChatBox'

describe('ChatBox', () => {
  const mockMessages = [
    { id: '1', role: 'user', content: 'Hello' },
    { id: '2', role: 'ai', content: 'Hi there!' },
  ] as const

  it('renders messages correctly', () => {
    render(
      <ChatBox 
        messages={[...mockMessages]} 
        onSendMessage={() => {}} 
        isLoading={false} 
        error={null} 
      />
    )
    
    expect(screen.getByText('Hello')).toBeInTheDocument()
    expect(screen.getByText('Hi there!')).toBeInTheDocument()
  })

  it('displays empty state when no messages', () => {
    render(
      <ChatBox 
        messages={[]} 
        onSendMessage={() => {}} 
        isLoading={false} 
        error={null} 
      />
    )
    
    expect(screen.getByText(/Start a conversation/i)).toBeInTheDocument()
  })

  it('shows loader when isLoading is true', () => {
    render(
      <ChatBox 
        messages={[]} 
        onSendMessage={() => {}} 
        isLoading={true} 
        error={null} 
      />
    )
    
    expect(screen.getByTestId('loader')).toBeInTheDocument()
  })

  it('shows error message when error is present', () => {
    render(
      <ChatBox 
        messages={[]} 
        onSendMessage={() => {}} 
        isLoading={false} 
        error="Failed to send" 
      />
    )
    
    expect(screen.getByText('Failed to send')).toBeInTheDocument()
  })
})
