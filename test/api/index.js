import importDir from 'import-dir'
import chai from 'chai'
import request from 'axios'

const tests = importDir('./tests')
var expect = chai.expect;

describe('Test', () => {
  Object.keys(tests).forEach(name => tests[name](request, expect));
});
