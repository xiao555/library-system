export default {
  activeBooks: (state) => {

    const { lists, postsPerPage } = state
    const page = Number(state.route.params.page) || 1
    const start = (page - 1) * postsPerPage
    const end = page * postsPerPage
    console.log(lists['books']);
    if (lists['books']) {
      return lists['books'].slice(start, end)
    }
  }
}
