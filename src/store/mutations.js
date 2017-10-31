import Vue from 'vue'

export default {
  SET_LISTS: (state, { model, data }) => {
    switch(model) {
      case 'getBook':
        state.lists['books'] = data.data
        break;
      case 'userBookInfo':
        state.lists['userBooks'] = data.data
        break;
      case 'getUser':
        state.lists['users'] = data.data
        break;
    }
  },
  ADD_TO_CART: (state, obj) => {
    state.carts.push(obj)
  }
}
