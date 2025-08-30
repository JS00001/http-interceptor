import Settings from '@ui/pages/settings';
import Intercept from '@ui/pages/intercept';

export type Route = keyof typeof Routes;

const Routes = {
  '/intercept': Intercept,
  '/settings': Settings,
} as const;

export default Routes;
