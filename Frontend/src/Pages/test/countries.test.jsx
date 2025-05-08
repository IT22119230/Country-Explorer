// Countries.test.jsx
import React from 'react';
import { render, screen, prettyDOM, logRoles } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Countries from '../Countries';

// Complete mock for countriesSlice
jest.mock('../../redux/country/countriesSlice', () => ({
  __esModule: true,
  fetchCountries: jest.fn(() => ({ 
    type: 'countries/fetchCountries',
    payload: [{ 
      name: { common: 'Japan' }, 
      cca3: 'JPN',
      languages: { jpn: 'Japanese' },
      region: 'Asia'
    }]
  })),
  default: jest.fn((state = {
    countries: [],
    status: 'idle',
    error: null,
    favorites: []
  }, action) => {
    console.log('Redux action dispatched:', action.type);
    
    switch (action.type) {
      case 'countries/fetchCountries/pending':
        return { ...state, status: 'loading' };
      case 'countries/fetchCountries/fulfilled':
        return { 
          ...state, 
          status: 'succeeded',
          countries: action.payload
        };
      default:
        return state;
    }
  })
}));

// Mock icons
jest.mock('react-icons/fi', () => ({
  FiSearch: () => <span>SearchIcon</span>,
  FiFilter: () => <span>FilterIcon</span>,
  FiX: () => <span>CloseIcon</span>,
  FiArrowLeft: () => <span>BackIcon</span>,
}));

// Mock loading skeleton
jest.mock('react-loading-skeleton', () => ({
  __esModule: true,
  default: ({ count = 1, height, width }) => {
    console.log(`Rendering ${count} skeleton(s) with height ${height}, width ${width}`);
    return (
      <div data-testid="loading-skeleton">
        {Array.from({ length: count }).map((_, i) => (
          <span key={i}>LoadingSkeleton</span>
        ))}
      </div>
    );
  }
}));

jest.mock('react-loading-skeleton/dist/skeleton.css', () => {
  console.log('CSS import mocked');
  return {};
});

// Mock CountryCard
jest.mock('../../Components/CountryCard', () => ({ country }) => {
  console.log('CountryCard rendered with:', country);
  return (
    <div data-testid="country-card">
      <h3>{country.name.common}</h3>
      <p>Region: {country.region}</p>
    </div>
  );
});

// Mock router hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => {
    const mockNavigate = jest.fn();
    console.log('useNavigate called, returning mock function');
    return mockNavigate;
  },
  useLocation: () => {
    console.log('useLocation called, returning empty search');
    return { search: '' };
  },
}));

describe('Countries Component', () => {
  const createTestStore = (preloadedState = {}) => {
    console.log('Creating store with initial state:', preloadedState);
    const store = configureStore({
      reducer: {
        countries: require('../../redux/country/countriesSlice').default,
        user: () => ({ currentUser: null }) // Mock user reducer
      },
      preloadedState
    });

    // Log store changes
    const originalDispatch = store.dispatch;
    store.dispatch = (action) => {
      console.log('Dispatching action:', action.type);
      return originalDispatch(action);
    };

    return store;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    console.log('\n===== Starting New Test =====');
  });

  it('renders loading state', () => {
    const store = createTestStore({
      countries: {
        countries: [],
        status: 'loading',
        error: null
      }
    });

    const { container } = render(
      <Provider store={store}>
        <Countries />
      </Provider>
    );

    console.log('\n=== Loading State Rendered Output ===');
    console.log(prettyDOM(container));
    console.log('====================================\n');
    
    console.log('Accessible roles in component:');
    logRoles(container);

    const skeletons = screen.getAllByTestId('loading-skeleton');
    console.log(`Found ${skeletons.length} loading skeletons`);

    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders countries list with Japan', async () => {
    const store = createTestStore({
      countries: {
        countries: [{ 
          name: { common: 'Japan' }, 
          cca3: 'JPN',
          languages: { jpn: 'Japanese' },
          region: 'Asia'
        }],
        status: 'succeeded',
        error: null
      }
    });

    const { container } = render(
      <Provider store={store}>
        <Countries />
      </Provider>
    );

    console.log('\n=== Countries List (Japan) Rendered Output ===');
    console.log(prettyDOM(container));
    console.log('====================================\n');
    
    console.log('Accessible roles in component:');
    logRoles(container);

    const countryElement = await screen.findByText('Japan');
    console.log('Found country element:', prettyDOM(countryElement));

    const countryCards = screen.getAllByTestId('country-card');
    console.log(`Found ${countryCards.length} country cards`);
    countryCards.forEach(card => console.log('Card content:', prettyDOM(card)));

    expect(countryElement).toBeInTheDocument();
  });
});
