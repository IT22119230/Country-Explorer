import userReducer, {
    signInStart,
    signInSuccess,
    singInFailure,
    signOut
  } from './userSlice';
  
  describe('userSlice', () => {
    const initialState = {
      currentUser: null,
      loading: false,
      error: false,
    };
  
    it('should handle initial state', () => {
      expect(userReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  
    it('should handle signInStart', () => {
      const nextState = userReducer(initialState, signInStart());
      expect(nextState.loading).toBe(true);
    });
  
    it('should handle signInSuccess', () => {
      const user = { name: 'John' };
      const nextState = userReducer(initialState, signInSuccess(user));
      expect(nextState.currentUser).toEqual(user);
      expect(nextState.loading).toBe(false);
      expect(nextState.error).toBe(false);
    });
  
    it('should handle singInFailure', () => {
      const nextState = userReducer(initialState, singInFailure('Error'));
      expect(nextState.loading).toBe(false);
      expect(nextState.error).toBe('Error');
    });
  
    it('should handle signOut', () => {
      const loggedInState = {
        currentUser: { name: 'John' },
        loading: false,
        error: false,
      };
      const nextState = userReducer(loggedInState, signOut());
      expect(nextState.currentUser).toBeNull();
    });
  });
  