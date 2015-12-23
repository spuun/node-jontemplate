var fs 		= require('fs');
var path 	= require('path');
var _ 		= require('lodash');

var createTemplateEngine = (options) => {

	options = Object.assign({
		trim: true
	}, options);

	var log = (type, msg) => {
		if (options.log != undefined && options.log[type] != undefined)
			options.log[type](msg);
	};
	var compiledTemplates 	= {};

	var compile = (filename) => {
		if (!fs.existsSync(filename)) {
			var err = 'Template doesn\'t exist: ' + filename;
			log('error', err);
			throw err;
		}
		log('debug', 'Compiling ' + filename);
		return _.template(fs.readFileSync(filename));
	};

	var renderFile = (filename, data, callback) => {
		log('silly', 'render ' + filename + ' with params ' + JSON.stringify(data));
		if (!compiledTemplates[filename]) {
			try {
				compiledTemplates[filename] = compile(filename);
				log('silly', 'Caching compiled template for ' + filename);
//				watch(filename, () => delete compiledTemplates[filename]);	
			} catch (err) {
				if (typeof callback == 'function')
					return callback(new Error(err));
				return false;
			}
		} else {
			log('debug', 'Using cached template for ' + filename);
		}
		if (data === undefined) {
			data = {};
		}
		var rendered = compiledTemplates[filename](data);
		if (options.trim)
			rendered = rendered.replace(/^\s*(.*?)\s*$/, '$1');
		if (typeof callback == 'function')
			return callback(null, rendered);
		return rendered;
	};

	/*
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
		 */
	_.assign(_, { 
		render: renderFile
	});
	renderFile.cache = {
		invalidate: (file) => {
			if (compiledTemplates[file])
				delete compiledTemplates[file];
		},
		clear: () => {
			compiledTemplates = {};
		}
	};
	return renderFile;
};


module.exports = createTemplateEngine;
