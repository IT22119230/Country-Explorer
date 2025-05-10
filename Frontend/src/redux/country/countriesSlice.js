import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


const saveFavoritesToLocalStorage = (favorites) => {
  localStorage.setItem('favorites', JSON.stringify(favorites));
};


const loadFavoritesFromLocalStorage = () => {
  try {
    const favorites = localStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error loading favorites from localStorage:', error);
    return [];
  }
};

export const fetchCountries = createAsyncThunk(
  'countries/fetchAll',
  async () => {
    const response = await fetch('https://restcountries.com/v3.1/all');
    if (!response.ok) throw new Error('Failed to fetch countries');
    return await response.json();
  }
);

export const searchCountries = createAsyncThunk(
  'countries/search',
  async (name) => {
    const response = await fetch(`https://restcountries.com/v3.1/name/${name}`);
    if (!response.ok) throw new Error('Country not found');
    return await response.json();
  }
);

export const filterByRegion = createAsyncThunk(
  'countries/filterRegion',
  async (region) => {
    const response = await fetch(`https://restcountries.com/v3.1/region/${region}`);
    if (!response.ok) throw new Error('Failed to filter by region');
    return await response.json();
  }
);

export const fetchCountryByCode = createAsyncThunk(
  'countries/fetchByCode',
  async (code) => {
    const response = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
    if (!response.ok) throw new Error('Country not found');
    const data = await response.json();
    return data[0];
  }
);

const countriesSlice = createSlice({
  name: 'countries',
  initialState: {
    countries: [],
    favorites: loadFavoritesFromLocalStorage(),
    status: 'idle',
    error: null,
    lastUpdated: null
  },
  reducers: {
    addFavorite: (state, action) => {
      if (!state.favorites.some(country => country.cca3 === action.payload.cca3)) {
        state.favorites.push(action.payload);
        saveFavoritesToLocalStorage(state.favorites);
        state.lastUpdated = new Date().toISOString();
      }
    },
    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter(
        country => country.cca3 !== action.payload
      );
      saveFavoritesToLocalStorage(state.favorites);
      state.lastUpdated = new Date().toISOString();
    },
    clearFavorites: (state) => {
      state.favorites = [];
      localStorage.removeItem('favorites');
      state.lastUpdated = new Date().toISOString();
    },
    syncFavorites: (state) => {
      state.favorites = loadFavoritesFromLocalStorage();
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.countries = action.payload;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(searchCountries.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(searchCountries.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.countries = action.payload;
      })
      .addCase(searchCountries.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(filterByRegion.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(filterByRegion.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.countries = action.payload;
      })
      .addCase(filterByRegion.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchCountryByCode.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCountryByCode.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (!state.countries.some(c => c.cca3 === action.payload.cca3)) {
          state.countries.push(action.payload);
        }
      })
      .addCase(fetchCountryByCode.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { 
  addFavorite, 
  removeFavorite, 
  clearFavorites,
  syncFavorites 
} = countriesSlice.actions;

export const selectFavorites = (state) => state.countries.favorites;
export const selectLastUpdated = (state) => state.countries.lastUpdated;

export default countriesSlice.reducer;