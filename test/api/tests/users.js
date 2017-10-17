'use strict';

import api from '../api'

const testname = Math.random()*1000
const user = {
  uname: testname.toString(),
  passwd: 'testuser',
};

export default function testUsers(request, expect) {
  describe('Register', () => {
    it('should register user', () => {

      request.get(api.register, {
        params: user
      }).then(res => {
        let data = JSON.parse(res.data.trim())
        expect(data.code).to.equal(6)
      }).catch(err => {
        console.log(err)
      })
    })
  })

  describe('Register again', () => {
    it('should get 用户名已存在', () => {

      request.get(api.register, {
        params: user
      }).then(res => {
        let data = JSON.parse(res.data.trim())
        expect(data.code).to.equal(7)
      }).catch(err => {
        console.log(err)
      })
    })
  })
}
