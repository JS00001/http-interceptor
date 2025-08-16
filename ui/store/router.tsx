import { create } from "zustand";
import type { Route } from "@ui/routes";

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
    pathname: "/intercept",
    stack: ["/intercept"],
  };

  const push = (route: Route) => {
    set((state) => ({
      ...state,
      pathname: route,
      stack: [...state.stack, route],
    }));
  };

  const replace = (route: Route) => {
    set((state) => ({
      ...state,
      pathname: route,
      stack: [route],
    }));
  };

  const back = () => {
    set((state) => {
      const stack = state.stack.slice(0, state.stack.length - 1);
      const route = stack[stack.length - 1];
      return { ...state, pathname: route, stack };
    });
  };

  return {
    ...initialState,
    push,
    replace,
    back,
  };
});

export default useRouter;
