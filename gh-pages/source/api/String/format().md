    String.prototype.format(Array|Object values, [RegExp pattern=/\{([\w_\-]+)\}/g]) => String
    
~~~js
'Hi {0}, welcome to {1} !'.format(['Lytc', '"One"']))
// => 'Hi Lytc, welcome to "One" !'

'Hi {name}, welcome to {lib} !'.format({name: 'Lytc', lib: '"One"'}))
// => 'Hi Lytc, welcome to "One" !'

'Hi [0], welcome to [1] !'.format(['Lytc', '"One"'], /\[([\w_\-]+)\]/g))
// => 'Hi Lytc, welcome to "One" !'
~~~