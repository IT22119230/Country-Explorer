import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './user/userSlice';
import countriesReducer from './country/countriesSlice';

const rootReducer = combineReducers({
  user: userReducer,
  countries: countriesReducer,
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['user'] 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);