'use client';

import { useEffect, useState } from 'react';
import { store } from './store';

export function useAppStore() {
  const [state, setState] = useState(() => store.getState());

  useEffect(() => {
    setState(store.getState());
    const unsubscribe = store.subscribe(() => {
      setState({ ...store.getState() });
    });
    return () => unsubscribe();
  }, []);

  return {
    currentUser: state.currentUser,
    users: state.users,
    charities: state.charities,
    scores: state.scores,
    draws: state.draws,
    winners: state.winners,
    store,
  };
}
