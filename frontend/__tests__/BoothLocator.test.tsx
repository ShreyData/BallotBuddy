import { render, screen } from '@testing-library/react'
import BoothLocator from '../components/BoothLocator'

// Mock the Google Maps Loader
jest.mock('@googlemaps/js-api-loader', () => ({
  Loader: jest.fn().mockImplementation(() => ({
    load: jest.fn().mockResolvedValue({
      maps: {
        Map: jest.fn().mockImplementation(() => ({
          setCenter: jest.fn(),
          setZoom: jest.fn(),
        })),
        Marker: jest.fn(),
        InfoWindow: jest.fn(),
        places: {
          PlacesService: jest.fn().mockImplementation(() => ({
            nearbySearch: jest.fn(),
          })),
          PlacesServiceStatus: { OK: 'OK' },
        },
        SymbolPath: { CIRCLE: 0 },
      },
    }),
  })),
}))

describe('BoothLocator', () => {
  it('renders correctly with loading state', () => {
    render(<BoothLocator />)
    expect(screen.getByText('Nearby Polling Booths')).toBeInTheDocument()
    // It starts in loading state because useEffect is async
    expect(screen.getByText(/Showing booths within 5km/i)).toBeInTheDocument()
  })

  it('renders map container', () => {
    const { container } = render(<BoothLocator />)
    const mapDiv = container.querySelector('.h-\\[500px\\]')
    expect(mapDiv).toBeInTheDocument()
  })
})
