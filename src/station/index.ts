import StationPage from './StationPage.vue';
import StationDataPage from './StationDataPage.vue';

// const routes: Array<RouteRecordRaw> = [{ path: '/', component: ReadingsPage }];
const routes = [
  { path: '/station/:id/data', component: StationDataPage },
  { path: '/station/:id', component: StationPage },
];

export default { routes };
