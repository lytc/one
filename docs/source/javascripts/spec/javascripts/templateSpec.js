describe('$.template', function() {
  var html = 'Hi <%= this.name %>, welcome to "<%= this.lib %>" !'
  var tpl = $.template(html)
  
  it('initialize', function() {  
    expect(tpl instanceof $.Template).toBeTruthy()
    expect(tpl.template).toEqual(html)
    expect(tpl.compiledFn).toBe(null)
  })
  
  it('compile', function() {
    tpl.compile()
    expect($.isFunction(tpl.compiledFn)).toBeTruthy()
  })
  
  it('initialize with data', function() {
    var content = $.template(html, {name: 'Lytc', lib: 'One'})
    expect(content).toEqual('Hi Lytc, welcome to "One" !')
  })
  
  it('render', function() {
    var content = tpl.render({name: 'Lytc', lib: 'One'})
    expect(content).toEqual('Hi Lytc, welcome to "One" !')
  })
  
  it('render with loop', function() {
    var tpl = $.template(
      '<h3>Product</h3>',
      '<ul>',
        '<% for (var i = 0; i < this.items.length; ++i) { %>',
        '<li><%= this.items[i].name %></li>',
        '<% } %>',
      '</ul>'
    )
    var data = {
      items: [
        {name: 'item 1'},
        {name: 'item 2'}
      ]
    }
    
    var content = tpl.render(data)
    var expected = ['<h3>Product</h3>',
      '<ul>',
        '<li>item 1</li>',
        '<li>item 2</li>',
      '</ul>'].join('')
    
    expect(expected).toEqual(content)
  })
  
  it('with $.each', function() {
    var tpl = $.template(
      '<h3>Product</h3>',
      '<ul>',
        '<% $.each(this.items, function() { %>',
        '<li><%= this.name %></li>',
        '<% }) %>',
      '</ul>'
    )
    var data = {
      items: [
        {name: 'item 1'},
        {name: 'item 2'}
      ]
    }
    
    var content = tpl.render(data)
    var expected = ['<h3>Product</h3>',
      '<ul>',
        '<li>item 1</li>',
        '<li>item 2</li>',
      '</ul>'].join('')
    
    expect(expected).toEqual(content)
  })
  
  it('with complex data', function() {
    var tpl = $.template(
      '<h3>Product</h3>',
      '<ul>',
        '<% for (var i = 0; i < this.categories.length; ++i) { %>',
        '<li>',
          '<%= this.categories[i].name %>',
          '<ul>',
            '<% for (var j = 0; j < this.categories[i].items.length; ++j) { %>',
            '<li><%= this.categories[i].items[j].name %></li>',
            '<% } %>',
          '</ul>',
        '</li>',
        '<% } %>',
      '</ul>'
    )
    var data = {
      categories: [
        {
          name: 'Category 1'
          ,items: [
            {name: 'item 1'},
            {name: 'item 2'}
          ]
        },{
          name: 'Category 2'
          ,items: [
            {name: 'item 3'},
            {name: 'item 4'}
          ]
        }
      ]
    }
    
    var content = tpl.render(data)
    var expected = [
        '<h3>Product</h3>',
        '<ul>',
          '<li>',
            'Category 1',
            '<ul>',
              '<li>item 1</li>',
              '<li>item 2</li>',
            '</ul>',
          '</li>',
          '<li>',
            'Category 2',
            '<ul>',
              '<li>item 3</li>',
              '<li>item 4</li>',
            '</ul>',
          '</li>',
        '</ul>'
      ].join('')
    
    expect(expected).toEqual(content)
  })
  
  it('helpers', function() {
    var tpl = $.template('<div><%= this.escape(this.name) %></div>')
    var data = {name: '<b>lytc</b>'}
    var content = tpl.render(data)
    var expected = '<div>&lt;b&gt;lytc&lt;/b&gt;</div>'
    expect(content).toEqual(expected)
  })
})