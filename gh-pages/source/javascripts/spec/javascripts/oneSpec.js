describe('$', function() {
  // $.extend()
  describe('extend()', function() {
    var object = {one: 1, two: 2}
    it('should be returned an copied object', function() {
      expect($.extend({}, object)).toEqual(object)
    })
    it('should be returned an extended object', function() {
      expect($.extend({three: 3}, object)).toEqual({one: 1, two: 2, three: 3})
    })
    it('should be returned an extended object with recusive', function() {
      var object = {foo: {bar: {baz: 1}}}
      var extendedObject = $.extend({}, object, true)
      expect(extendedObject).toEqual({foo: {bar: {baz: 1}}})
      expect(extendedObject).toNotBe(object)
      expect(extendedObject.foo).toNotBe(object.foo)
      expect(extendedObject.foo.bar).toNotBe(object.foo.bar)
    })
  })
  
  // $.noop
  describe('noop', function() {
    it('noop should be a function', function() {
      expect(typeof $.noop).toEqual('function')
    })
    
    it('noop should be noop', function() {
      expect($.noop).toEqual($.noop)
    })
  })
  
  // $.sequence()
  describe('sequence()', function() {
    it('increase 1 when call', function() {
      var sequence = $.sequence()
      expect($.sequence()).toEqual(sequence + 1)
    })
    it('increase 1 when call with prefix', function() {
      var sequence = $.sequence('prefix')
      var number = parseInt(sequence.match(/(\d+)$/)[1])
      expect(parseInt($.sequence('prefix').match(/(\d+)$/)[1])).toEqual(number + 1)
    })
  })
  
  // $.error()
  describe('error()', function() {
    it('return new Error when call', function() {
      var message = 'this is an error'
          ,error = $.error(message)
          
      expect(error instanceof Error).toBeTruthy()
      expect(error.message).toEqual(message)
    })
  })
  
  // $.getType()
  describe('getType()', function() {
    it('should be type string', function() {
      expect($.getType('this is a string')).toEqual('String')
    })
    
    it('should be type number', function() {
      expect($.getType(1)).toEqual('Number')
      expect($.getType(-10.3)).toEqual('Number')
      expect($.getType(NaN)).toEqual('Number')
    })
    
    it ('should be type array', function() {
      expect($.getType([])).toEqual('Array')
    })
    
    it('should be type type function', function() {
      expect($.getType(function(){})).toEqual('Function')
    })
  })
  
  // $.isString()
  describe('isString()', function() {
    it('should be truthy', function() {
      expect($.isString('it me!')).toBeTruthy()
    })
    it('should be falsy', function() {
      expect($.isString(1)).toBeFalsy()
    })
  })
  
  // $.isNumber()
  describe('isNumber()', function() {
    it('should be truthy', function() {
      expect($.isNumber(1)).toBeTruthy()
    })
    it('should be falsy', function() {
      expect($.isNumber('it me!')).toBeFalsy()
    })
  })
  
  // $.isFunction()
  describe('isFunction()', function() {
    it('should be truthy', function() {
      expect($.isFunction(function(){})).toBeTruthy()
    })
    it('should be falsy', function() {
      expect($.isFunction('it me!')).toBeFalsy()
    })
  })
  
  // $.isLikeArray()
  describe('isLikeArray()', function() {
    it('should be truthy', function() {
      expect($.isLikeArray([])).toBeTruthy()
      expect($.isLikeArray(arguments)).toBeTruthy()
    })
    it('should be falsy', function() {
      expect($.isLikeArray('it me!')).toBeFalsy()
    })
  })
  
  // $.isObject()
  describe('isObject()', function() {
    it('shold be truthy', function() {
      expect($.isObject({})).toBeTruthy()
      expect($.isObject(new function(){})).toBeTruthy()
    })
    it('should be falsy', function() {
      expect($.isObject('')).toBeFalsy()
    })
  })
  
  // $.isPlainObject()
  describe('isPlainObject()', function() {
    it('should be truthy', function() {
      expect($.isPlainObject({})).toBeTruthy()
    })
    it('should be falsy', function() {
      expect($.isPlainObject(new function(){})).toBeFalsy()
    })
  })
  
  // $.isNode()
  describe('isNode()', function() {
    it('should be truthy', function() {
      expect($.isNode(document.documentElement)).toBeTruthy()
    })
    it('should be falsy', function() {
      expect($.isNode(window)).toBeFalsy()
    })
  })
  
  // $.isElement()
  describe('isElement()', function() {
    it('should be truthy', function() {
      expect($.isElement(document.querySelector('*'))).toBeTruthy()
    })
    it('shoud be falsy', function() {
      expect($.isElement(document)).toBeFalsy()
    })
  })
  
  // $.isNodeList()
  describe('isNodeList()', function() {
    it('should be truthy', function() {
      expect($.isNodeList(document.querySelectorAll('*'))).toBeTruthy()
    })
    it('should be falsy', function() {
      expect($.isNodeList(document)).toBeFalsy()
    })
  })
  
  // $.isHtmlCollection()
  describe('isHtmlCollection()', function() {
    it('should be truthy', function() {
      expect($.isHtmlCollection(document.forms)).toBeTruthy()
    })
    it('should be falsy', function() {
      expect($.isHtmlCollection(document)).toBeFalsy()
    })
  })
  
  // $.isDefined()
  describe('isDefined()', function() {
    it('should be return true with defined variable', function() {
      expect($.isDefined(this)).toBeTruthy()
    })
    
    window._testIsDefined = {foo: {bar: 1}}
    it('should be return true with defined object property with default context', function() {
      expect($.isDefined('_testIsDefined.foo.bar')).toBeTruthy()
    })
    it('should be return false with undefined pbject property with default context', function() {
      expect($.isDefined('undefined_variable.bar.baz')).toBeFalsy()
    })
    
    var foo = {bar: {baz: 1}}
    it('should be return true with defined object property with custom context', function() {
      expect($.isDefined('bar.baz', foo)).toBeTruthy()
    })
    it('should be return false with undefined object property with custom context', function() {
      expect($.isDefined('bar.bar', foo)).toBeFalsy()
    })
  })
  
  // $.each()
  describe('each()', function() {
    describe('each with array', function() {
      var arr = [1, 2, 3]
          ,spy
          ,callback = function(index, v, o) {
            val = v
          }
          ,callbackReturnFalse = function(index, v, o) {
            val = v
            return false
          }
          ,val
        
      function setup() {
        spy = {
          callback: callback
        }
        spyOn(spy, 'callback')
        $.each(arr, spy.callback)
      }
    
      it('tracks that callback was called', function() {
        setup()
        expect(spy.callback).toHaveBeenCalled()
      })
    
      it('tracks its number of calls', function() {
        setup()
        expect(spy.callback.calls.length).toEqual(arr.length)
      })
    
      it('tracks all the arguments of its calls', function() {
        setup()
        for (var i = 0; i < arr.length; ++i) {        
          expect(spy.callback).toHaveBeenCalledWith(i, arr[i], arr)
        }
      })
    
      it ('should be returned the last item value', function() {
          expect($.each(arr, callback)).toEqual(arr[arr.length-1])
      })
    
      it('should be breaked when callback return false', function() {     
        expect($.each(arr, callbackReturnFalse)).toEqual(arr[0])
        expect(val).toEqual(arr[0])
      }) 
    })
    
    // $.each()
    describe('each with object', function() {
      var o = {one: 1, two: 2, three: 3}
          ,spy
          ,callback = function(index, v, o) {
            val = v
          }
          ,callbackReturnFalse = function(index, v, o) {
            val = v
            return false
          }
          ,val
        
      function setup() {
        spy = {
          callback: callback
        }
        spyOn(spy, 'callback')
        $.each(o, spy.callback)
      }
    
      it('tracks that callback was called', function() {
        setup()
        expect(spy.callback).toHaveBeenCalled()
      })
    
      it('tracks its number of calls', function() {
        setup()
        expect(spy.callback.calls.length).toEqual(Object.keys(o).length)
      })
    
      it('tracks all the arguments of its calls', function() {
        setup()
        for (var i in o) {        
          expect(spy.callback).toHaveBeenCalledWith(i, o[i], o)
        }
      })
    
      it ('should be returned the last item value', function() {
          expect($.each(o, callback)).toEqual(o.three)
      })
    
      it('should be breaked when callback return false', function() {     
        expect($.each(o, callbackReturnFalse)).toEqual(o.one)
        expect(val).toEqual(o.one)
      }) 
    })
  })
  
  // $.map()
  describe('map()', function() {
    it('map with array', function() {
      var result = $.map([1, 2, 3], function() {
        return this + 1
      })
      expect(result).toEqual([2, 3, 4])
    })
    it('map with object', function() {
      var result = $.map({one: 1, two: 2, three: 3}, function() {
        return this + 1
      })
      expect(result).toEqual({one: 2, two: 3, three: 4})
    })
  })
  
  // $.namespace()
  describe('namespace()', function() {
    it('should created a new object', function() {
      expect($.namespace('foo.bar.baz')).toEqual({})
    })
    it('should not override existing object', function() {
      window.foo = {bar: {one: 1}}
      $.namespace('foo.bar.baz')
      expect(window.foo).toEqual({bar: {one: 1, baz: {}}})
    })
    it('with custom scope', function() {
      var object = {foo: {}}
      $.namespace('foo.bar.baz', object)
      expect(object).toEqual({foo: {bar: {baz: {}}}})
    })
  })
  
  // $.createElement()
  describe('createElement()', function() {
    it('should be created a new element', function() {
      var el = $.createElement('div')
      expect($.isElement(el)).toBeTruthy()
    })
    it('should be created a new element with properties', function() {
      var el = $.createElement('div', {class: 'klass'})
      expect(el.getAttribute('class')).toEqual('klass')
    })
  })
  
  // $.toArray()
  describe('toArray()', function() {
    it('should be return an array', function() {
      expect($.isArray($.toArray(arguments))).toBeTruthy()
    })
    
    it('should be return an array with non likeArray argument', function() {
      var result = $.toArray(1)
      expect(result).toEqual([1])
    })
  })
  
  // $.ready()
  describe('ready()', function() {
    
    
    it('tracks that callback was called', function() {
      var spy = {callback: function() {}}
      spyOn(spy, 'callback')
      $.ready(spy.callback)
      expect(spy.callback).toHaveBeenCalled()
    })
    
    it('tracks its number of calls', function() {
      var spy = {callback: function() {}}
      spyOn(spy, 'callback')
      $.ready(spy.callback)
      expect(spy.callback.calls.length).toEqual(1)
    })
  })
  
  // $.query()
  describe('query()', function() {
    var id = $.sequence('id')
        ,div = document.createElement('div')
        ,div1 = document.createElement('div')
        ,div2 = document.createElement('div')
        ,div3 = document.createElement('div')
        ,div4 = document.createElement('div')
    
    div.id = id
    div1.className = 'class1'
    div2.className = 'class2'
    div3.className = 'class3'
    div4.className = 'class4'
    
    div.appendChild(div1)
    div.appendChild(div2)
    div.appendChild(div3)
    div.appendChild(div4)
    
    it('should be the same document.querySelectorAll', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(div)
        expect($.query('*', div)).toEqual(div.querySelectorAll('*'))
        div.parentNode.removeChild(div)
      }) 
    })
    
    it('child combinator', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(div)
        expect($.query('> div', div)).toEqual(document.querySelectorAll('#' + id + ' > div'))
        div.parentNode.removeChild(div)
      }) 
    })
    
    it('adjacent next sibling combinator', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(div)
        expect($.query('+ div', div1)[0]).toEqual(div2)
        div.parentNode.removeChild(div)
      }) 
    })
    
    it('general next sibling combinator', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(div)
        expect($.query('~ .class3', div1)[0]).toEqual(div3)
        div.parentNode.removeChild(div)
      }) 
    })
    
    it('adjacent previous sibling combinator', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(div)
        expect($.query('- div', div2)[0]).toEqual(div1)
        div.parentNode.removeChild(div)
      }) 
    })
    
    it('general previous sibling combinator', function() {
      waitsFor(function() {
        return $.ready(function(){return true})
      })
      
      runs(function() {
        document.body.appendChild(div)
        expect($.query('<~ .class1', div3)[0]).toEqual(div1)
        div.parentNode.removeChild(div)
      }) 
    })
  })
  
  // $.vendorPrefix
  describe('vendorPrefix', function() {
    it('should be in the list', function() {
      expect(['' ,'moz', 'webkit', 'o', 'ms']).toContain($.vendorPrefix)
    })
  })
})