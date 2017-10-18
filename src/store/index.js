import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
// import getters from './getters'

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
    state: {
      postsPerPage: 10,
      isLogin: false,
      lists: {},
      categorys: {},
      user: '',
      carts: [],
    },
    actions,
    mutations,
    getters: {
      activeBooks: (state) => {

        const { lists, postsPerPage } = state
        return lists['books']
        // const page = Number(state.route.params.page) || 1
        // const start = (page - 1) * postsPerPage
        // const end = page * postsPerPage
        // console.log(lists['books']);
        // if (lists['books']) {
        //   return lists['books'].slice(start, end)
        // }
      }
    }
  })
}
