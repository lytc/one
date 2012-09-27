describe('$.ajax', function() {
  var xhr = $.ajax('url', {
    before: function() {
      return false
    }
  })
  
  $.ajax.defaultOptions.disableCaching = false
  
  var onreadystatechange = xhr.onreadystatechange
  var onabort = xhr.onabort
  
  $.ajax.createXhr = function() {
    var fakeXhr = function() {
      
    }
    
    $.extend(fakeXhr.prototype, {
      readyState: 0
      ,open: function() {}
      ,setRequestHeader: function() {}
      ,response: function(options) {
        $.extend(this, options)
        this.readyState = 4
        onreadystatechange.bind(this)()
      }
      ,getResponseHeader: function(name) {
        if ($.isDefined('headers.' + name, this)) {
          return this.headers[name]
        }
      }
      ,abort: function() {
        onabort.bind(this)()
      }
      ,send: $.noop
    })
    
    var xhr = new fakeXhr
    return xhr
  }
  
  var url = 'url'
  it('request options', function() {
    var xhr = $.ajax(url)
    expect(xhr.options.url).toBe(url)
    
    xhr = $.ajax({url: url})
    expect(xhr.options.url).toBe(url)
    
    var success = function(){}
    xhr = $.ajax(success)
    expect(xhr.options.success).toBe(success)
  })
  
  it('default options', function() {
    var xhr = $.ajax()
    var defaultOptions = $.ajax.defaultOptions
    var options = xhr.options
    
    expect(options.url).toBe('.')
    expect(options.method).toBe(defaultOptions.method)
    expect(options.timeout).toBe(defaultOptions.timeout)
    expect(options.async).toBe(defaultOptions.async)
    expect(options.headers).toEqual(defaultOptions.baseHeaders)
    expect(options.data).toBe(defaultOptions.data)
    expect(options.responseType).toBe(defaultOptions.responseType)
    expect(options.disableCaching).toBe(defaultOptions.disableCaching)
    expect(options.before).toBe(defaultOptions.before)
    expect(options.complete).toBe(defaultOptions.complete)
    expect(options.success).toBe(defaultOptions.success)
    expect(options.error).toBe(defaultOptions.error)
    expect(options.abort).toBe(defaultOptions.abort)
  })
  
  it('tracks that callback was called on successful', function() {
    var responseText = 'response text'
    var before = jasmine.createSpy()
    var complete = jasmine.createSpy()
    var success = jasmine.createSpy()
    var error = jasmine.createSpy()
    
    xhr = $.ajax({
      before: before
      ,complete: complete
      ,success: success
      ,error: error
    })

    xhr.response({
      status: 200
      ,responseText: responseText
    })
    
    expect(before).toHaveBeenCalled()
    expect(before.calls[0].args[0]).toBe(xhr)
    
    expect(complete).toHaveBeenCalled()
    expect(complete.calls[0].args[0]).toBe(xhr)
    
    expect(success).toHaveBeenCalled()
    expect(success.calls[0].args[0]).toEqual(responseText)
    expect(success.calls[0].args[1]).toBe(xhr)
    
    expect(error).not.toHaveBeenCalled()
  })
  
  it('tracks that callback was called on failed', function() {
    var responseText = 'response text'
    var before = jasmine.createSpy()
    var complete = jasmine.createSpy()
    var success = jasmine.createSpy()
    var error = jasmine.createSpy()
    
    xhr = $.ajax({
      before: before
      ,complete: complete
      ,success: success
      ,error: error
    })

    xhr.response({
      status: 500
      ,responseText: responseText
    })
    
    expect(before).toHaveBeenCalled()
    expect(before.calls[0].args[0]).toBe(xhr)
    
    expect(complete).toHaveBeenCalled()
    expect(complete.calls[0].args[0]).toBe(xhr)
    
    expect(success).not.toHaveBeenCalled()
    
    expect(error).toHaveBeenCalled()
    expect(error.calls[0].args[0]).toBe(xhr)
  })
  
  it('tracks that abort was called', function() {
    var complete = jasmine.createSpy()
    var abort = jasmine.createSpy()
    
    xhr = $.ajax({
      complete: complete
      ,abort: abort
    })
    
    xhr.abort()
    
    expect(complete).toHaveBeenCalled()
    expect(complete.calls[0].args[0]).toBe(xhr)
    
    expect(abort).toHaveBeenCalled()
    expect(abort.calls[0].args[0]).toBe(xhr)
  })
  
  it('should timeout', function() {
    var complete = jasmine.createSpy()
    var abort = jasmine.createSpy()
    
    xhr = $.ajax({
      complete: complete
      ,abort: abort
      ,timeout: 1
    })
    
    var flag = false
    
    waitsFor(function() {
      return flag
    })
    
    setTimeout(function() {
      flag = true
    }, 1)
    
    runs(function() {
      expect(complete).toHaveBeenCalled()
      expect(complete.calls[0].args[0]).toBe(xhr)
    
      expect(abort).toHaveBeenCalled()
      expect(abort.calls[0].args[0]).toBe(xhr)
    })
  })
  
  it('response json data', function() {
    var result = {foo: '1', bar: 'bar', baz: 'this is it!'}
    var responseText = JSON.stringify(result)
    var success = jasmine.createSpy()
    
    var xhr = $.ajax({
      success: success
      ,responseType: 'json'
    })
    
    xhr.response({
      status: 200
      ,responseText: responseText
    })
    
    expect(success).toHaveBeenCalled()
    expect(success.calls[0].args[0]).toEqual(result)
    
    //
    xhr = $.ajax({
      success: success
      ,responseType: 'application/json'
    })
    
    xhr.response({
      status: 200
      ,responseText: responseText
    })
    
    expect(success).toHaveBeenCalled()
    expect(success.calls[1].args[0]).toEqual(result)
    
    //
    xhr = $.ajax({
      success: success
    })
    
    xhr.response({
      status: 200
      ,responseText: responseText
      ,headers: {
        'content-type': 'application/json'
      }
    })
    
    expect(success).toHaveBeenCalled()
    expect(success.calls[2].args[0]).toEqual(result)
  })
  
  it('with data', function() {
    var url = 'url'
    var data = {foo: 'bar', baz: 'qux'}
    var xhr = $.ajax(url, {
      data: data
    })
    expect(xhr.options.url).toBe($.appendQuery(url, data))
  })
  
  it('get()', function() {
    var url = 'url'
    
    var xhr = $.get(url)
    xhr.response({
      status: 200
      ,resonseText: 'responseText'
    })
            
    expect(xhr.options.url).toBe(url)
    expect(xhr.options.responseType).toBe($.ajax.defaultOptions.responseType)
    
    //
    var success = jasmine.createSpy()
    var responseType = 'json'
    var result = {foo: 'bar'}
    
    var xhr = $.get(url, success, responseType)
    
    xhr.response({
      status: 200
      ,responseText: JSON.stringify(result)
    })
    
    expect(xhr.options.url).toBe(url)
    expect(xhr.options.responseType).toBe(responseType)
    expect(success).toHaveBeenCalled()
    expect(success.calls[0].args[0]).toEqual(result)
  })
  
  it('getJson()', function() {
    var success = jasmine.createSpy()
    var result = {foo: 'bar'}
    
    var xhr = $.getJson(url, success)
    
    xhr.response({
      status: 200
      ,responseText: JSON.stringify(result)
    })
    
    expect(xhr.options.url).toBe(url)
    expect(xhr.options.responseType).toBe('json')
    expect(success).toHaveBeenCalled()
    expect(success.calls[0].args[0]).toEqual(result)
  })
  
  xit('getXml()', function() {
    
  })
  
  it('getScript()', function() {
    var success = jasmine.createSpy()
    var result = {foo: 'bar'}
    
    var xhr = $.getScript(url, success)
    
    xhr.response({
      status: 200
      ,responseText: JSON.stringify(result)
    })
    
    expect(xhr.options.url).toBe(url)
    expect(xhr.options.responseType).toBe('script')
    expect(success).toHaveBeenCalled()
    expect(success.calls[0].args[0]).toEqual(result)
  })
  
  it('post()', function() {
    var url = 'url'
    var data = {foo: 'bar'}
    var success = jasmine.createSpy()
    var responseType = 'json'
    var result = {foo: 'bar'}
    
    var xhr = $.post(url, data, success, responseType)
    xhr.response({
      status: 200
      ,responseText: JSON.stringify(result)
    })
    
    expect(xhr.options.method).toBe('POST')
    expect(xhr.options.url).toBe(url)
    expect(xhr.options.responseType).toBe(responseType)
    expect(xhr.options.success).toBe(success)
    expect(success).toHaveBeenCalled()
    expect(success.calls[0].args[0]).toEqual(result)
    
    //
    xhr = $.post(url, success, responseType)
    xhr.response({
      status: 200
      ,responseText: JSON.stringify(result)
    })
    
    expect(xhr.options.method).toBe('POST')
    expect(xhr.options.url).toBe(url)
    expect(xhr.options.responseType).toBe(responseType)
    expect(xhr.options.success).toBe(success)
    expect(success).toHaveBeenCalled()
    expect(success.calls[1].args[0]).toEqual(result)
  })
  
  xit('pool()', function() {
    
  })
})