var assert = require('assert');
var path = require('path');
var jontemplate = require('../lib/template.js');

var p = (f) => {
	return path.join(__dirname, 'templates', f);
};

describe('jontemplate', () => {
  var render = jontemplate();
  it('should render var1', () => {
 		assert.equal(
			render(p('render_var1.html'), {var1: 'ok'})
			,'ok');
	});
  it('should render list1', () => {
    assert.equal(
      render(p('render_list1.html'), {list1:['a', 'b', 'c']}),
     'abc'); 
  });
	it('should render plain', () => {
		assert.equal(
			render(p('render_plain.html')),
			'ok');
	});
	it('should render var1 express style', done => {
		render(p('render_var1.html'), {var1: 'express'}, (err, data) => {
			assert.equal(data, 'express');
			done();
		});
	});
	it('should render plain express style', done => {
		render(p('render_plain.html'), (err, data) => {
			assert.equal(data, 'ok');
			done();
		});
	});
});
