import { produce } from 'immer';
import { create } from 'zustand';

import type { Route } from '@ui/routes';

interface RouterState {
  stack: Route[];
  pathname: Route;
}

interface RouterStore extends RouterState {
  back: () => void;
  push: (route: Route) => void;
  replace: (route: Route) => void;
}

const useRouter = create<RouterStore>()((set) => {
  const initialState: RouterState = {
    pathname: '/intercept',
    stack: ['/intercept'],
  };

  const push = (route: Route) => {
    set((state) =>
      produce(state, (draft) => {
        draft.pathname = route;
        draft.stack.push(route);
      })
    );
  };

  const replace = (route: Route) => {
    set((state) =>
      produce(state, (draft) => {
        draft.stack = [route];
        draft.pathname = route;
      })
    );
  };

  const back = () => {
    set((state) =>
      produce(state, (draft) => {
        // Remove the current route from the stack
        draft.stack = draft.stack.slice(0, draft.stack.length - 1);
        // Set the current pathname to the last item in the stack
        draft.pathname = draft.stack[draft.stack.length - 1];
      })
    );
  };

  return {
    ...initialState,
    push,
    replace,
    back,
  };
});

export default useRouter;
