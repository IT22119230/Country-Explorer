import countriesReducer, {
  fetchCountries,
  addFavorite,
  removeFavorite
} from './countriesSlice';

describe('countriesSlice', () => {
  const initialState = {
    countries: [],
    favorites: [],
    status: 'idle',
    error: null
  };

  it('should handle initial state', () => {
    expect(countriesReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle addFavorite', () => {
    const country = { name: 'Japan', cca3: 'JPN' };
    const nextState = countriesReducer(initialState, addFavorite(country));
    expect(nextState.favorites).toContainEqual(country);
  });

  it('should handle removeFavorite', () => {
    const state = {
      ...initialState,
      favorites: [{ name: 'Japan', cca3: 'JPN' }]
    };
    const nextState = countriesReducer(state, removeFavorite('JPN'));
    expect(nextState.favorites).toEqual([]);
  });

  it('should handle fetchCountries.pending', () => {
    const action = { type: fetchCountries.pending.type };
    const nextState = countriesReducer(initialState, action);
    expect(nextState.status).toBe('loading');
  });

  it('should handle fetchCountries.fulfilled', () => {
    const fakeData = [{ name: 'Japan', cca3: 'JPN' }];
    const action = { type: fetchCountries.fulfilled.type, payload: fakeData };
    const nextState = countriesReducer(initialState, action);
    expect(nextState.status).toBe('succeeded');
    expect(nextState.countries).toEqual(fakeData);
  });

  it('should handle fetchCountries.rejected', () => {
    const action = { type: fetchCountries.rejected.type, error: { message: 'Error' } };
    const nextState = countriesReducer(initialState, action);
    expect(nextState.status).toBe('failed');
    expect(nextState.error).toBe('Error');
  });
});
