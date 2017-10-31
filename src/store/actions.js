import api from '../api'
export default {
  FETCH_LISTS: ({ commit, state }, { model, query }) => {
    return api.fetch(model, query).then(data => {
      // console.log(data);
      commit('SET_LISTS', { model, data })
      return data
    })
  }
}
