import StationPage from './StationPage.vue';
import StationDataPage from './StationDataPage.vue';

// const routes: Array<RouteRecordRaw> = [{ path: '/', component: ReadingsPage }];
const routes = [
  // /station/3400TH/data - try to show all data for a station.
  // /station/3400TH/level-flow - show level and flow data for a station.
  { path: '/station/:id/:type(data|level-flow)', component: StationDataPage },
  { path: '/station/:id', component: StationPage },
  // /stations/level-flow - show level and flow data for a number of stations.
];

export default { routes };
