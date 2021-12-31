export default {
  namespaced: true,
  actions: {
    get: async () => {
      return Promise.resolve([123, 456]);
    },
  },
};
