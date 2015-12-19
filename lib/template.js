var fs 		= require('fs');
var path 	= require('path');
var _ 		= require('lodash');

var createTemplateEngine = (options) => {
	options = Object.assign({
		path: 'templates',
		extension: 'html'
	}, options);

	var extensionRegExp 	= new RegExp('\.' + options.extension);
	var compiledTemplates 	= {};

	var compile = (templateName) => {
		var templatePath = path.join(options.path, templateName + '.' + options.extension)
		if (!fs.existsSync(templatePath)) {
			var err = 'Template doesn\'t exists: ' + templateName;
			throw err;
		}
		return _.template(fs.readFileSync(templatePath));
	};

	var render = (templateName, data) => {
		if (!compiledTemplates[templateName]) {
			compiledTemplates[templateName] = compile(templateName);
		}
		if (data === undefined) {
			data = {};
		}
		return compiledTemplates[templateName](data);
	};

	fs.watch(options.path, { recursive: true }, (event, filename) => {
		if (filename.match(extensionRegExp)) {
			var templateName = filename.replace(extensionRegExp,'');
			if (compiledTemplates[templateName]) {
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
