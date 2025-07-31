import { create } from "zustand";
import type { Route } from "@/routes";

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
    pathname: "/",
    stack: ["/"],
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
      const stackCopy = [...state.stack];
      const route = stackCopy.pop();
      return { ...state, pathname: route, stack: stackCopy };
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
