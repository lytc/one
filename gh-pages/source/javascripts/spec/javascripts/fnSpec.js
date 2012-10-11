describe('Function.prototype', function() {
  it('should work with createAlias', function() {
    var scope
    var obj = {
      callback: function() {
        scope = this
      }
    }
    
    var alias = $.createAlias(obj, 'callback')
    alias()
    expect(scope).toBe(obj)
  })
  
  describe('createBuffered', function() {
    it('should not called', function() {
      var callback = jasmine.createSpy()
      var buffered = callback.createBuffered(1)
      buffered()
      expect(callback).not.toHaveBeenCalled()
    })
  
    it('should called', function() {
      var callback = jasmine.createSpy()
      var buffered = callback.createBuffered(1)
      buffered()
      var flag = false
      waitsFor(function() {
        return flag
      })
    
      setTimeout(function() {
        flag = true
      }, 2)
    
      runs(function() {
        expect(callback).toHaveBeenCalled()
      })
    })
  
    it('should called with right arguments', function() {
      var callback = jasmine.createSpy()
      var buffered = callback.createBuffered(1)
      
      buffered(1, 2, 3)
      var flag = false
      waitsFor(function() {
        return flag
      })
    
      setTimeout(function() {
        flag = true
      }, 2)
    
      runs(function() {
        expect(callback).toHaveBeenCalled()
        expect(callback).toHaveBeenCalledWith(1, 2, 3)
      })
    })
    
    it('should called with right context', function() {
      var scope = {}
      var expectedScope
      var callback = (function() {
        expectedScope = this
      }).bind(scope)
      
      var buffered = callback.createBuffered(1)
      
      buffered()
      var flag = false
      waitsFor(function() {
        return flag
      })
    
      setTimeout(function() {
        flag = true
      }, 2)
    
      runs(function() {
        expect(expectedScope).toBe(scope)
      })
    })
    
    it('should called one within the period', function() {
      var callback = jasmine.createSpy()
        ,buffered = callback.createBuffered(1)
        buffered()
        buffered()
        
        var flag = false
        waitsFor(function() {
          return flag
        })
        
        setTimeout(function() {
          flag = true
        }, 1)
        
        runs(function() {
          expect(callback.callCount).toEqual(1)
        })
    })
  })
  
  describe('createRepeated', function() {
    it('should not called', function() {
      var callback = jasmine.createSpy()
      var repeated = callback.createRepeated(1)
      repeated()
      expect(callback).not.toHaveBeenCalled()
    })
    
    it('should called', function() {
      var callback = jasmine.createSpy()
      var repeated = callback.createRepeated(1)
      repeated()
      
      var flag = false
      waitsFor(function() {
        return flag
      })
      
      setTimeout(function() {
        flag = true
      }, 1)
      
      runs(function() {        
        expect(callback).toHaveBeenCalled()
      }) 
    })
    
    it('should repeated', function() {
      var callback = jasmine.createSpy()
      var repeated = callback.createRepeated(1)
      repeated()
      
      var flag = false
      waitsFor(function() {
        return flag
      })
      
      setTimeout(function() {
        flag = true
      }, 100)
      
      runs(function() {        
        expect(callback.calls.length).toBeGreaterThan(1)
      }) 
    })
    
    it('should called with right arguments', function() {
      var callback = jasmine.createSpy()
      var repeated = callback.createRepeated(1)
      
      repeated(1, 2, 3)
      var flag = false
      waitsFor(function() {
        return flag
      })
    
      setTimeout(function() {
        flag = true
      }, 2)
    
      runs(function() {
        expect(callback).toHaveBeenCalled()
        expect(callback).toHaveBeenCalledWith(1, 2, 3)
      })
    })
    
    it('should called with right context', function() {
      var scope = {}
      var expectedScope
      var callback = (function() {
        expectedScope = this
      }).bind(scope)
      
      var repeated = callback.createRepeated(1)
      
      repeated()
      var flag = false
      waitsFor(function() {
        return flag
      })
    
      setTimeout(function() {
        flag = true
      }, 2)
    
      runs(function() {
        expect(expectedScope).toBe(scope)
      })
    })
    
    it('should stop when called stop', function() {
      var callback = jasmine.createSpy()
      var repeated = callback.createRepeated(1)
      repeated()
      repeated.stop()
      
      var flag = false
      waitsFor(function() {
        return flag
      })
      
      setTimeout(function() {
        flag = true
      }, 1)
      
      runs(function() {        
        expect(callback).not.toHaveBeenCalled()
      })
    })
  })
  
  describe('createInterceptor', function() {
    it('should work', function() {
      var passedFn = jasmine.createSpy()
      var fn = jasmine.createSpy()
      var intercepter = fn.createInterceptor(passedFn)
      intercepter()
      
      expect(passedFn).toHaveBeenCalled()
      expect(fn).toHaveBeenCalled()
    })
    
    it('should passed function called before the original function', function() {
      var lastCalledFrom
          ,passedFn = function() { lastCalledFrom = 'passed fn' }
          ,fn = function() { lastCalledFrom = 'orig fn' }
          ,intercepter = fn.createInterceptor(passedFn)
          
      intercepter()
      
      expect(lastCalledFrom).toEqual('orig fn')
    })
    
    it('should not call the original function if the passed function return false', function() {
      var passedFn = function() { return false }
          ,fn = jasmine.createSpy()
          ,intercepter = fn.createInterceptor(passedFn)
          
      intercepter()
      
      expect(fn).not.toHaveBeenCalled()
    })
  })
  
  describe('defer', function() {
    it('should called', function() {
      var callback = jasmine.createSpy()
      callback.defer()
      expect(callback).not.toHaveBeenCalled()
      
      var flag = false
      waitsFor(function() {
        return flag
      })
      
      setTimeout(function() {
        flag = true
      })
      
      runs(function() {
        expect(callback).toHaveBeenCalled()
      })
    })
  })
})