var fs 		= require('fs');
var path 	= require('path');
var _ 		= require('lodash');
var log 	= require('./log');

var createTemplateEngine = (options) => {
	options = Object.assign({
		path: 'templates',
		extension: 'html'
	}, options);

	var extensionRegExp 	= new RegExp('\.' + options.extension);
	var compiledTemplates 	= {};

	var compile = (templateName) => {
		log.silly('template', 'compile(' + templateName + ')');
		var templatePath = path.join(options.path, templateName + '.' + options.extension)
		if (!fs.existsSync(templatePath)) {
			var err = 'Template doesn\'t exists: ' + templateName;
			log.error('template', err);
			throw err;
		}
		log.info('template', 'Compiling template ' + templateName);
		return _.template(fs.readFileSync(templatePath));
	};

	var render = (templateName, data) => {
		log.silly('template', 'render(' + templateName + ', ' + JSON.stringify(data) + ')');
		if (!compiledTemplates[templateName]) {
			compiledTemplates[templateName] = compile(templateName);
		}
		log.debug('template', 'Rendering template ' + templateName);
		log.debug('template', 'ViewData:', data);
		if (data === undefined) {
			data = {};
		}
		return compiledTemplates[templateName](data);
	};

	fs.watch(options.path, { recursive: true }, (event, filename) => {
		if (filename.match(extensionRegExp)) {
			var templateName = filename.replace(extensionRegExp,'');
			if (compiledTemplates[templateName]) {
				log.info('template', 'Template ' + templateName + ' changed. Removing cached compilation.');
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