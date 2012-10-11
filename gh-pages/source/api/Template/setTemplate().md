    $.Template.setTemplate(String tpl) => $.Template

~~~js
var template = $.template()
template.setTemplate('Hi <%= this.name %>, welcome to "<%= this.lib %>"!')

template.render({name: 'Lytc', lib: 'One.js'})
// => 'Hi Lytc, welcome to "One.js"!'
~~~