describe('$.Node', function() {
  it('$.Node() should return an array object', function() {
    expect($.isArray($.node())).toBeTruthy()
    expect($.isArray($('*'))).toBeTruthy()
  })
  
  var id = $.sequence('id')
      ,count = 5
      ,rootNode = document.createElement('div')
      ,node
      ,childNode
      ,nodes = {}
  
  rootNode.id = id
  
  for (var i = 0; i < count; ++i) {
    nodes[i] = {}
    node = document.createElement('div')
    node.className = 'class' + i
    nodes[i].node = node
    nodes[i].children = {}
    for (var j = 0; j < count; ++j) {
      childNode = document.createElement('div')
      childNode.className = 'class' + i + j
      nodes[i].children[j] = childNode
      node.appendChild(childNode)
    }
    rootNode.appendChild(node)
  }
  
  // index()
  describe('index()', function() {
    it('should be return -1', function() {
      expect($.node().index()).toEqual(-1)
    })
  
    it('shoul be return the index', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        for (var i = 0; i < count; ++i) {      
          expect($('.class' + i).index()).toEqual(i)
        }
        rootNode.parentNode.removeChild(rootNode)
      })
    })
  })
  
  // get()
  describe('get()', function() {
    it('should be return the right item', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        for (var i = 0; i < count; ++i) {          
          expect($('#' + id + ' > div').get(0)).toEqual(nodes[0].node)
        }
        expect($('#' + id + ' > div').get(100)).toBeUndefined()
        rootNode.parentNode.removeChild(rootNode)
      })
    })
  })
  
  // item()
  describe('item()', function() {
    it('should be return the right item', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        for (var i = 0; i < count; ++i) {  
          expect($('#' + id + ' > div').item(i).length).toBe(1)        
          expect($('#' + id + ' > div').item(i)).toContain(nodes[i].node)
        }
        expect($('#' + id + ' > div').item(100).length).toBe(0)
        rootNode.parentNode.removeChild(rootNode)
      })
    })
  })
  
  // first()
  describe('first()', function() {
    it('should be return emtpy node list', function() {
      expect($.node().first().length).toBe(0)
    })
    
    it('should be return the right item', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        expect($('#' + id + ' > div').first().length).toBe(1)
        expect($('#' + id + ' > div').first()).toContain(nodes[0].node)
        rootNode.parentNode.removeChild(rootNode)
      })
    })
    
    it('with text node', function() {
      var nodes = $('text node<div>text node1</div>text node2<div>text node3</div>text node4')
      expect(nodes.first()[0].innerHTML).toBe('text node1')
      expect(nodes.first(true)[0].textContent).toBe('text node')
    })
  })
  
  // last()
  describe('last()', function() {
    it('should be return emtpy node list', function() {
      expect($.node().last().length).toBe(0)
    })
    
    it('should be return the right item', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        expect($('#' + id + ' > div').last().length).toBe(1)
        expect($('#' + id + ' > div').last()).toContain(nodes[count - 1].node)
        rootNode.parentNode.removeChild(rootNode)
      })
    })
  })
  
  // each()
  describe('each()', function() {
    var spy
    beforeEach(function() {
      spy = {callback: function(index, nodes, node) {}}
      spyOn(spy, 'callback')
    })
    
    it('tracks that the callback was called', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        
        $('#' + id + ' > div').each(spy.callback)
        expect(spy.callback).toHaveBeenCalled()
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
    
    it('tracks its number of calls', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        var nodeList = $('#' + id + ' > div')
        nodeList.each(spy.callback)
        expect(spy.callback.calls.length).toEqual(nodeList.length)
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
    
    it('tracks all the arguments of its calls', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        var nodeList = $('#' + id + ' > div')
        nodeList.each(spy.callback)
        for (var i = 0; i < nodeList.length; ++i) {          
          expect(spy.callback).toHaveBeenCalledWith(i, nodeList, nodeList[i])
        }
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
    
    it('allows access to the most recent call', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        var nodeList = $('#' + id + ' > div')
        nodeList.each(spy.callback)
        for (var i = 0; i < nodeList.length; ++i) {          
          expect(spy.callback.mostRecentCall.args[1]).toBe(nodeList)
        }
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
  })
  
  // filter()
  describe('filter()', function() {
    it('filter', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        var nodeList = $('#' + id + ' > div');
        var nodeListFiltered = nodeList.filter(function(index, nodes) {
          return !!(index % 2)
        })
        
        expect(nodeListFiltered.length).toEqual(Math.floor(nodeList.length / 2))
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
  })
  
  // matches
  describe('matches()', function() {
    it('matches', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        var nodeList = $('#' + id + ' > div');
        var matches = nodeList.matches('.class2')
        
        expect(matches.length).toEqual(1)
        expect(matches[0]).toBe(nodes[2].node)
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
  })
  
  // is()
  describe('is()', function() {
    it('is', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        var nodeList = $('#' + id + ' > div');
        expect(nodeList.is(rootNode)).toBeFalsy()
        expect(nodeList.is('div')).toBeTruthy()
        
        for (var i = 0; i < count; ++i) {
          expect(nodeList.is(nodes[i].node)).toBeTruthy()
        }
        
        rootNode.parentNode.removeChild(rootNode)
      })
    }) 
  })
  
  // ancestors()
  describe('ancestors()', function() {
    it('with no arguments', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        var nodeList
        for (var i = 0; i < count; ++i) {
          nodeList = $('.class' + i).ancestors()
          expect(nodeList.length).toBe(1)
          expect(nodeList[0]).toBe(rootNode)
        }
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
    
    it('with level & no selector', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        var nodeList
        for (var i = 0; i < count; ++i) {
          nodeList = $('.class1' + i).ancestors(2)
          expect(nodeList.length).toBe(1)
          expect(nodeList[0]).toBe(rootNode)
        }
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
    
    it('with selector & no level', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        var nodeList
        for (var i = 0; i < count; ++i) {
          nodeList = $('.class1' + i).ancestors('div')
          expect(nodeList.length).toBe(1)
          expect(nodeList[0]).toBe(nodes[1].node)
        }
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
    
    it('with level & selector', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        var nodeList
        for (var i = 0; i < count; ++i) {
          nodeList = $('.class1' + i).ancestors(2, 'div')
          expect(nodeList.length).toBe(1)
          expect(nodeList[0]).toBe(rootNode)
        }
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
  })
  
  // parent()
  describe('parent()', function() {
    it('with no arguments', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        var nodeList
        for (var i = 0; i < count; ++i) {
          nodeList = $('.class' + i).parent()
          expect(nodeList.length).toBe(1)
          expect(nodeList[0]).toBe(rootNode)
        }
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
    
    it('with selector', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        var nodeList
        for (var i = 0; i < count; ++i) {
          nodeList = $('.class' + i).parent('#' + id)
          expect(nodeList.length).toBe(1)
          expect(nodeList[0]).toBe(rootNode)
        }
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
  })
  
  // find()
  describe('find()', function() {
    it('find with no arguments', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        var nodeList = $('#' + id).find()
        expect(nodeList.length).toEqual(count * count + count)
        for (var i = 0; i < count; ++i) {
          expect(nodeList).toContain(nodes[i].node)
          for (var j = 0; j < count; ++j) {
            expect(nodeList).toContain(nodes[i].children[j])
          }
        }
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
    
    it('find with selector', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        
        var nodeList = $('#' + id).find('.class11')
        expect(nodeList.length).toEqual(1)
        expect(nodeList).toContain(nodes[1].children[1])
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
  })
  
  // children()
  describe('children()', function() {
    it('with no arguments', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        
        var nodeList = $('#' + id).children()
        expect(nodeList.length).toEqual(count)
        for (var i = 0; i < count; ++i) {          
          expect(nodeList).toContain(nodes[i].node)
        }
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
    
    it('with selector', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        
        var nodeList = $('#' + id).children('.class1')
        
        expect(nodeList.length).toEqual(1)
        expect(nodeList).toContain(nodes[1].node)
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
  })
  
  // next()
  describe('next()', function() {
    it('with no selector', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        
        var nodeList = $('#' + id + '> .class1').next()
        
        expect(nodeList.length).toEqual(1)
        expect(nodeList).toContain(nodes[2].node)
        
        nodeList = $('#' + id + ' > .class' + (count - 1)).next()
        expect(nodeList.length).toEqual(0)
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
    
    it('with selector', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        
        var nodeList = $('#' + id + '> .class1').next('.class2')
        
        expect(nodeList.length).toEqual(1)
        expect(nodeList).toContain(nodes[2].node)
        
        nodeList = $('#' + id + ' > .class' + (count - 1)).next('div')
        expect(nodeList.length).toEqual(0)
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
  })
  
  // prev()
  describe('prev()', function() {
    it('with no selector', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        
        var nodeList = $('#' + id + '> .class1').prev()
        
        expect(nodeList.length).toEqual(1)
        expect(nodeList).toContain(nodes[0].node)
        
        nodeList = $('#' + id + ' > .class0').prev()
        expect(nodeList.length).toEqual(0)
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
    
    it('with selector', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        
        var nodeList = $('#' + id + '> .class1').prev('.class0')
        
        expect(nodeList.length).toEqual(1)
        expect(nodeList).toContain(nodes[0].node)
        
        nodeList = $('#' + id + ' > .class0').prev('div')
        expect(nodeList.length).toEqual(0)
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
  })
  
  // nextSiblings()
  describe('nextSiblings()', function() {
    it('with no selector', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        
        var index = 1
            ,nodeList = $('#' + id + '> .class' + index).nextSiblings()
        
        expect(nodeList.length).toEqual(count - index - 1)
        for (var i = index + 1; i < count; ++i) {          
          expect(nodeList).toContain(nodes[i].node)
        }
        
        nodeList = $('#' + id + ' > .class' + (count - 1)).nextSiblings()
        expect(nodeList.length).toEqual(0)
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
    
    it('with selector', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        
        var nodeList = $('#' + id + '> .class1').nextSiblings('.class2')
        
        expect(nodeList.length).toEqual(1)
        expect(nodeList).toContain(nodes[2].node)
        
        nodeList = $('#' + id + ' > .class' + (count - 1)).nextSiblings('div')
        expect(nodeList.length).toEqual(0)
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
  })
  
  // prevSiblings()
  describe('prevSiblings()', function() {
    it('with no selector', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        
        var index = 1
            ,nodeList = $('#' + id + '> .class' + index).prevSiblings()
        
        expect(nodeList.length).toEqual(count - (count - index))
        for (var i = index - 1; i >= 0; --i) {          
          expect(nodeList).toContain(nodes[i].node)
        }
        
        nodeList = $('#' + id + ' > .class0').prevSiblings()
        expect(nodeList.length).toEqual(0)
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
    
    it('with selector', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(rootNode)
        
        var nodeList = $('#' + id + '> .class2').prevSiblings('.class1')
        
        expect(nodeList.length).toEqual(1)
        expect(nodeList).toContain(nodes[1].node)
        
        nodeList = $('#' + id + ' > .class0').prevSiblings('div')
        expect(nodeList.length).toEqual(0)
        
        rootNode.parentNode.removeChild(rootNode)
      })
    })
  })
  
  // append()
  describe('append()', function() {
    it('append html', function() {
      var node = document.createElement('div')
      $(node).append('content')
      expect(node.innerHTML).toBe('content')
      $(node).append('append')
      expect(node.innerHTML).toBe('contentappend')
    })
      
    it('append a single node', function() {
      var node = document.createElement('div')
      var child = document.createElement('div')
      var child2 = document.createElement('div')
      $(node).append(child)
      expect(node.firstElementChild).toBe(child)
      $(node).append(child2)
      expect(node.lastElementChild).toBe(child2)
    })
      
    it('append nodes', function() {
      var node = document.createElement('div')
      var child = document.createElement('div')
      var child2 = document.createElement('div')
      $(node).append([child, child2])
      expect(node.children[0]).toBe(child)
      expect(node.children[1]).toBe(child2)
    })
  })
    
  // prepend()
  describe('prepend()', function() {
    it('prepend html', function() {
      var node = document.createElement('div')
      $(node).prepend('content')
      expect(node.innerHTML).toBe('content')
      $(node).prepend('prepend')
      expect(node.innerHTML).toBe('prependcontent')
    })
      
    it('prepend a single node', function() {
      var node = document.createElement('div')
      var child = document.createElement('div')
      var child2 = document.createElement('div')
      $(node).prepend(child)
      expect(node.firstElementChild).toBe(child)
      $(node).prepend(child2)
      expect(node.firstElementChild).toBe(child2)
    })
      
    it('prepend nodes', function() {
      var node = document.createElement('div')
      var child = document.createElement('div')
      var child2 = document.createElement('div')
      $(node).prepend([child, child2])
      expect(node.children[0]).toBe(child)
      expect(node.children[1]).toBe(child2)
    })
  })
    
  // before()
  describe('before()', function() {
    it('before from html string', function() {
      var node = document.createElement('div')
      var child = document.createElement('div')
      node.appendChild(child)
      $(child).before('text node <div class="child">child</div>')
      expect($.isElement(child.previousElementSibling)).toBeTruthy()
      expect(child.previousElementSibling.previousSibling.textContent).toBe('text node ')
    })
      
    it('before from node', function() {
      var node = document.createElement('div')
      var child = document.createElement('div')
      var before = document.createElement('div')
      node.appendChild(child)
      $(child).before(before)
      expect(child.previousElementSibling).toBe(before)
    })
      
    it('before from nodes', function() {
      var node = document.createElement('div')
      var child = document.createElement('div')
      var before = document.createElement('div')
      var before2 = document.createElement('div')
      node.appendChild(child)
      $(child).before([before, before2])
      expect(child.previousElementSibling).toBe(before2)
      expect(child.previousElementSibling.previousElementSibling).toBe(before)
    })
  })
    
  // after()
  describe('after()', function() {
    it('after from html string', function() {
      var node = document.createElement('div')
      var child = document.createElement('div')
      node.appendChild(child)
      $(child).after('text node <div class="child">child</div>')
      expect(child.nextSibling.textContent).toBe('text node ')
      expect($.isElement(child.nextElementSibling)).toBeTruthy()
    })
      
    it('after from node', function() {
      var node = document.createElement('div')
      var child = document.createElement('div')
      var before = document.createElement('div')
      node.appendChild(child)
      $(child).after(before)
      expect(child.nextElementSibling).toBe(before)
    })
      
    it('next from nodes', function() {
      var node = document.createElement('div')
      var child = document.createElement('div')
      var after = document.createElement('div')
      var after2 = document.createElement('div')
      node.appendChild(child)
      $(child).after([after, after2])
      expect(child.nextElementSibling).toBe(after)
      expect(child.nextElementSibling.nextElementSibling).toBe(after2)
    })
  })
    
  // clone()
  describe('clone()', function() {
    it('clone single node', function() {
      var node = document.createElement('div')
      node.id = 'id'
      var cloned = $(node).clone()
      expect($.isElement(cloned[0])).toBeTruthy()
      expect(cloned[0].id).toBe('')
    })
      
    it('clone node list', function() {
      var node = document.createElement('div')
      var child = document.createElement('div')
      var child2 = document.createElement('div')
      child.className = 'child'
      child2.className = 'child2'
      node.appendChild(child)
      node.appendChild(child2)
      var cloned = $(node.children).clone()
      expect(cloned[0].className).toBe('child')
      expect(cloned[1].className).toBe('child2')
    })
  })
    
  // concat()
  describe('concat()', function() {
    it('concat with selector', function() {
      var node = document.createElement('div')        
      var nodeList = $(node).concat('div')
      expect(nodeList.length).toBe(document.querySelectorAll('div').length + 1)
    })
      
    it('concat with node', function() {
      var node = document.createElement('div')
      var node2 = document.createElement('div')
      var node3 = document.createElement('div')
        
      var nodeList = $(node)
      nodeList.concat(node2, node3)
        
      expect(nodeList.length).toBe(3)
      expect(nodeList[1]).toBe(node2)
      expect(nodeList[2]).toBe(node3)
    })
      
    it('concat with node list', function() {
      var node = document.createElement('div')  
          ,divNodes = document.querySelectorAll('div')
      var nodeList = $(node).concat(divNodes)
          
      expect(nodeList.length).toBe(divNodes.length + 1)
    })
  })
  
  // wrap()
  describe('wrap()', function() {
    it('wrap with connected dom node and no arguments', function() {
      var node = document.createElement('div')
          ,child = document.createElement('div')
      
      node.appendChild(child)    
      var wrapped = $(child).wrap()
      
      expect(child.parentNode.nodeName.toLowerCase()).toBe('div')
    })
    
    it('wrap with connected dom node', function() {
      var node = document.createElement('div')
          ,child = document.createElement('div')
      
      node.appendChild(child)    
      var wrapped = $(child).wrap('<div class="wrap">')
      expect(child.parentNode.nodeName.toLowerCase()).toBe('div')
      expect(child.parentNode.className).toBe('wrap')
    })
    
    it('wrap with disconnected dom node', function() {
      var node = document.createElement('div')
      var wrapped = $(node).wrap()
      expect(node.parentNode.nodeName.toLowerCase()).toBe('div')
    })
    
    it('wrap with complex html', function() {
      var node = document.createElement('div')
      var wrapped = $(node).wrap('text node<div class="wrap">text node 1</div> text node 2<div>text node3</div>')
      expect(node.parentNode.nodeName.toLowerCase()).toBe('div')
      expect(node.parentNode.className).toBe('wrap')
    })
    
    it('wrap with existing dom node', function() {
      var node = document.createElement('div')
      var wrap = document.createElement('div')
      
      var wrapped = $(node).wrap(wrap)
      expect(node.parentNode).toBe(wrap)
    })
    
    it('wrap with node list', function() {
      var node = document.createElement('div')
      var wrap = document.createElement('div')
      var wrap1 = document.createElement('div')
      var wrap2 = document.createElement('div')
      
      var wrapped = $(node).wrap([wrap, wrap1, wrap2])
      expect(node.parentNode).toBe(wrap)
    })
  })
  
  // unwrap()
  describe('unwrap()', function() {
    it('unwrap', function() {
      var node = document.createElement('div')
      var wrap = $.createElement('div')
      var wrapParent = wrap.parentNode
      wrap.appendChild(node)
      $(node).unwrap()
      expect(node.parentNode).toBe(wrapParent)
    })
  })
  
  // html()
  describe('html()', function() {
    it('get html', function() {
      var node = $.createElement('div', {html: 'html content'})
      expect($(node).html()).toBe('html content')
    })
    it('set html', function() {
      var node = $.createElement('div')
      $(node).html('html content')
      expect(node.innerHTML).toBe('html content')
    })
  })
  
  // data()
  describe('data()', function() {
    it('set & get data', function() {
      var node = $.createElement('div')
      $(node).data('foo', 'foo val')
      expect($(node).data('foo')).toBe('foo val')
      $(node).data({bar: 'bar val', baz: 'baz val'})
      expect($(node).data('bar')).toBe('bar val')
      expect($(node).data('baz')).toBe('baz val')
    })
  })
  
  // attr()
  describe('data()', function() {
    it('set & get attr', function() {
      var node = $.createElement('div')
      $(node).attr('foo', 'foo val')
      expect($(node).attr('foo')).toBe('foo val')
      $(node).attr({bar: 'bar val', baz: 'baz val'})
      expect($(node).attr('bar')).toBe('bar val')
      expect($(node).attr('baz')).toBe('baz val')
    })
  })
  
  // hasAttr()
  describe('hasAttr()', function() {
    var node = $($.createElement('div'))
    beforeEach(function() {
      node.attr({
        foo: 'foo'
        ,bar: 'bar'
      })
    })
    
    it('with single attr', function() {
      expect(node.hasAttr('foo')).toBeTruthy()
      expect(node.hasAttr('baz')).toBeFalsy()
    })
    
    it('with array of attrs', function() {
      expect(node.hasAttr(['foo', 'bar'])).toBeTruthy()
      expect(node.hasAttr(['foo', 'baz'])).toBeFalsy()
    })
    
    it('with arguments', function() {
      expect(node.hasAttr('foo', 'bar')).toBeTruthy()
      expect(node.hasAttr('foo', 'baz')).toBeFalsy()
    })
  })
  
  // removeAttr()
  describe('removeAttr()', function() {
    var node = $($.createElement('div'))
    beforeEach(function() {
      node.attr({
        foo: 'foo'
        ,bar: 'bar'
        ,baz: 'baz'
      })
    })
    
    it('with single attr', function() {
      expect(node.hasAttr('foo')).toBeTruthy()
      node.removeAttr('foo')
      expect(node.hasAttr('foo')).toBeFalsy()
    })
    
    it('with array of attrs', function() {
      expect(node.hasAttr(['foo', 'bar'])).toBeTruthy()
      node.removeAttr(['foo', 'bar'])
      expect(node.hasAttr(['foo', 'bar'])).toBeFalsy()
    })
    
    it('with arguments', function() {
      expect(node.hasAttr('foo', 'bar')).toBeTruthy()
      node.removeAttr('foo', 'bar')
      expect(node.hasAttr('foo', 'bar')).toBeFalsy()
    })
  })
  
  // hasClass()
  describe('hasClass()', function() {
    var node1 = $.createElement('div')
    var node2 = $.createElement('div')
    
    beforeEach(function() {
      node1.className = 'foo bar baz'
      node2.className = 'bar baz qux'
    })
    
    var node = $([node1, node2])
    
    it('with single class name', function() {
      expect(node.hasClass('foo')).toBeFalsy()
      expect(node.hasClass('bar')).toBeTruthy()
    })
    
    it('with array of class name', function() {
      expect(node.hasClass(['foo', 'bar'])).toBeFalsy()
      expect(node.hasClass(['bar', 'baz'])).toBeTruthy()
    })
    
    it('with arguments', function() {
      expect(node.hasClass('foo', 'bar')).toBeFalsy()
      expect(node.hasClass('bar', 'baz')).toBeTruthy()
    })
  })
  
  // addClass()
  describe('addClass()', function() {
    var node = $.createElement('div')
    beforeEach(function() {
      node.className = ''
    })
    
    it('with single class name', function() {
      $(node).addClass('foo')
      expect($(node).hasClass('foo')).toBeTruthy()
      $(node).addClass('bar baz')
      expect($(node).hasClass('bar baz')).toBeTruthy()
    })
    
    it('with array of class name', function() {
      $(node).addClass(['foo', 'bar'])
      expect($(node).hasClass(['foo', 'bar'])).toBeTruthy()
    })
    
    it('with arguments', function() {
      $(node).addClass('foo', 'bar')
      expect($(node).hasClass('foo', 'bar')).toBeTruthy()
    })
  })
  
  // removeClass()
  describe('removeClass()', function() {
    var n = $.createElement('div')
        ,node = $(n)
    beforeEach(function() {
      n.className = 'foo bar baz'
    })
    
    it('with single class name', function() {
      node.removeClass('foo')
      expect(node.hasClass('foo')).toBeFalsy()
      node.removeClass('bar baz')
      expect(node.hasClass('bar baz')).toBeFalsy()
    })
    
    it('with array of class name', function() {
      node.removeClass(['foo', 'bar'])
      expect(node.hasClass(['foo', 'bar'])).toBeFalsy()
    })
    
    it('with arguments', function() {
      node.removeClass('foo', 'bar')
      expect(node.hasClass('foo', 'bar')).toBeFalsy()
    })
  })
  
  // toggleClass()
  describe('toggleClass()', function() {
    var n = $.createElement('div')
        ,node = $(n)
    beforeEach(function() {
      n.className = 'foo bar'
    })
    
    it('with single class name', function() {
      node.toggleClass('foo')
      expect(node.hasClass('foo')).toBeFalsy()
      node.toggleClass('baz')
      expect(node.hasClass('baz')).toBeTruthy()
    })
      
    it('with class name separate by space', function() {
      node.toggleClass('foo baz')
      expect(node.hasClass('foo')).toBeFalsy()
      expect(node.hasClass('baz')).toBeTruthy()
    })
      
    it('with array of class name', function() {
      node.toggleClass(['foo', 'baz'])
      expect(node.hasClass('foo')).toBeFalsy()
      expect(node.hasClass('baz')).toBeTruthy()
    })
      
    it('with arguments', function() {
      node.toggleClass('foo', 'baz')
      expect(node.hasClass('foo')).toBeFalsy()
      expect(node.hasClass('baz')).toBeTruthy()
    })
  })
  
  // css()
  describe('css()', function() {
    var node = $($.createElement('div'))
    beforeEach(function() {
      node.attr('style', '')
    })
    
    it('get & set with key value', function() {
      node.css('color', 'red')
      expect(node.css('color')).toBe('red')
    })
    
    it('set with object', function() {
      node.css({
        color: 'red'
        ,backgroundColor: 'blue'
      })
      expect(node.css('color')).toBe('red')
      expect(node.css('background-color')).toBe('blue')
    })
    
    it('with vendor', function() {
      node.css('transition-property', 'width')
      expect(node.css('transition-property')).toBe('width')
    })
  })
  
  // width()
  describe('width()', function() {
    var node = $($.createElement())
    it('get & set', function() {
      node.width(100)
      expect(node.width()).toBe(100)
      node.width('200px')
      expect(node.width()).toBe(200)
      node.width('auto')
      expect(node.width()).toBe(0)
    })
  })
  
  // height()
  describe('height()', function() {
    var node = $($.createElement())
    it('get & set', function() {
      node.height(100)
      expect(node.height()).toBe(100)
      node.height('200px')
      expect(node.height()).toBe(200)
      node.height('auto')
      expect(node.height()).toBe(0)
    })
  })
  
  // top()
  describe('top()', function() {
    var node = $($.createElement())
    it('get & set', function() {
      node.top(100)
      expect(node.top()).toBe(100)
      node.top('200px')
      expect(node.top()).toBe(200)
      node.top('auto')
      expect(node.top()).toBe(0)
    })
  })
  
  // left()
  describe('left()', function() {
    var node = $($.createElement())
    it('get & set', function() {
      node.left(100)
      expect(node.left()).toBe(100)
      node.left('200px')
      expect(node.left()).toBe(200)
      node.left('auto')
      expect(node.left()).toBe(0)
    })
  })
  
  // offset()
  describe('offset()', function() {
    var node = $($.createElement())
    it('get & set', function() {
      node.offset({top: 10, left: 20, width: 30, height: 40})
      expect(node.top()).toBe(10)
      expect(node.left()).toBe(20)
      expect(node.width()).toBe(30)
      expect(node.height()).toBe(40)
    })
  })
})