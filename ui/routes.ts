import Intercept from '@ui/pages/intercept';
import Shortcuts from '@ui/pages/shortcuts';

export type Route = keyof typeof Routes;

const Routes = {
  '/intercept': Intercept,
  '/shortcuts': Shortcuts,
} as const;

export default Routes;
