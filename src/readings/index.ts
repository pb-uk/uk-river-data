import ReadingsPage from '../readings/ReadingsPage.vue';
import store from './store';

// const routes: Array<RouteRecordRaw> = [{ path: '/', component: ReadingsPage }];
const routes = [{ path: '/readings', component: ReadingsPage }];

export default { routes, store };
