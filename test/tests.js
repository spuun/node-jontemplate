var assert = require('assert');
var jontemplate = require('../lib/template.js');

describe('jontemplate', () => {
  var render = jontemplate({
    path: __dirname + '/templates/'
  });
  it('should render var1', () => {
    assert.equal(
      render('render_var1', {var1: 'ok'}), 
      'ok');
  });
  it('should render list1', () => {
    assert.equal(
      render('render_list1', {list1:['a', 'b', 'c']}),
     'abc'); 
  });
});
