    $.Template.render(Object data) => String

~~~js
var template = $.template('Hi <%= this.name %>, welcome to "<%= this.lib %>"!')

template.render({name: 'Lytc', lib: 'One.js'})
// => 'Hi Lytc, welcome to "One.js"!'

template.render({name: 'Anonymous', lib: 'One.js'})
// => 'Hi Anonymous, welcome to "One.js"!'
~~~