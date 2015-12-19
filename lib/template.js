var fs 		= require('fs');
var path 	= require('path');
var _ 		= require('lodash');

var createTemplateEngine = (options) => {
  options = Object.assign({
    path: './templates',
    extension: 'html',
    trim: true
  }, options);

  var log = (type, msg) => {
    if (options.log != undefined && options.log[type] != undefined)
      options.log[type](msg);
  };

  var extensionRegExp 	= new RegExp('\.' + options.extension);
  var compiledTemplates 	= {};

  var compile = (templateName) => {
    var templatePath = path.join(options.path, templateName + '.' + options.extension);
    if (!fs.existsSync(templatePath)) {
      var err = 'Template doesn\'t exist: ' + templateName;
      log('error', err);
      throw err;
    }
    log('debug', 'Compiling ' + templateName + '(' + templatePath + ')');
    return _.template(fs.readFileSync(templatePath));
  };

  var render = (templateName, data) => {
    log('silly', 'render ' + templateName + ' with params ' + JSON.stringify(data));
    if (!compiledTemplates[templateName]) {
      compiledTemplates[templateName] = compile(templateName);
    }
    if (data === undefined) {
      data = {};
    }
    var rendered = compiledTemplates[templateName](data);
    if (options.trim)
      rendered = rendered.replace(/^\s*(.*?)\s*$/, '$1');
    return rendered;
  };

  fs.watch(options.path, { recursive: true }, (event, filename) => {
    if (filename.match(extensionRegExp)) {
      var templateName = filename.replace(extensionRegExp,'');
      log('silly', 'Template ' + templateName + ' changed');
      if (compiledTemplates[templateName]) {
        log('debug', 'Template ' + templateName + ' changed. Clearing cache.');
        delete compiledTemplates[templateName];
      }
    }
  });

  _.assign(_, { 
    render: render
  });
  return render;
};


module.exports = createTemplateEngine;
