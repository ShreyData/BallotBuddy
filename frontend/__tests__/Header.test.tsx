import { render, screen } from '@testing-library/react'
import { Header } from '../components/Header'
import { LanguageProvider } from '../context/LanguageContext'
import { AuthContext } from '../context/AuthContext'

// Mock the AuthContext values
const mockAuthContext = {
  user: null,
  loading: false,
  signInWithGoogle: jest.fn(),
  logout: jest.fn(),
  getToken: jest.fn(),
}

describe('Header', () => {
  it('renders logo and navigation links', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <LanguageProvider>
          <Header />
        </LanguageProvider>
      </AuthContext.Provider>
    )
    
    expect(screen.getByText(/BallotBuddy AI/i)).toBeInTheDocument()
    expect(screen.getByText(/Chat/i)).toBeInTheDocument()
    expect(screen.getByText(/EVM Practice/i)).toBeInTheDocument()
  })

  it('shows login button when user is not logged in', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <LanguageProvider>
          <Header />
        </LanguageProvider>
      </AuthContext.Provider>
    )
    
    expect(screen.getByText(/Login with Google/i)).toBeInTheDocument()
  })

  it('shows user name and logout when user is logged in', () => {
    const loggedInContext = {
      ...mockAuthContext,
      user: { uid: '123', displayName: 'Test User' } as any
    }
    
    render(
      <AuthContext.Provider value={loggedInContext}>
        <LanguageProvider>
          <Header />
        </LanguageProvider>
      </AuthContext.Provider>
    )
    
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText(/Logout/i)).toBeInTheDocument()
  })
})
