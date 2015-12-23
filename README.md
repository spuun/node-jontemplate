# jontemplate
Simple template engine based on [lodash template](https://lodash.com/docs#template).

Compiled templates are cached. When a template changes cache will be cleared for that template.

## example
```javascript
var template = require('jontemplate');
var app = require('express')();
app.engine('html', template());
app.set('views', './views');
app.set('view engine', 'html');

app.get('/', (req, res) => {
	res.render('index', {someVar: 'hello world'});
});
```

*templates/index.html*
```html
<html>
<body>
someVar = <%= someVar %>

<% _.render('widget') %>
</body>
</html>
```

*templates/widget.html*
```html
<div>
  widget...
</div>
```
