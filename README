# jontemplate
Simple template engine based on [lodash template](https://lodash.com/docs#template).

Compiled templates are cached. When a template changes cache will be cleared for that template.

## example
```javascript
var template = require('./templates')({
  path: 'templates',
  extension: 'html'
});

console.log(template('index', {someVar: 'value'));
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
