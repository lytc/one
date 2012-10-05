describe('$.ajax', function() {
  $.ajax.defaultOptions.disableCaching = false
  var server = Mock.server
  
  beforeEach(function() {
    server.start()
  })
  
  afterEach(function() {
    server.stop()
  })
  
  it('default method', function() {
    var onSuccess = jasmine.createSpy()
    
    var ajax = $.ajax('url', {
      onSuccess: onSuccess
    })
    
    server.response({
      method: 'GET'
      ,url: 'url'
      ,responseText: 'ok'
    })
    
    expect(onSuccess).toHaveBeenCalled()
  })
  
  it('event listeners', function() {
    var onStart         = jasmine.createSpy()
        ,onStateChange  = jasmine.createSpy()
        ,onProgress     = jasmine.createSpy()
        ,onAbort        = jasmine.createSpy()
        ,onError        = jasmine.createSpy()
        ,onSuccess      = jasmine.createSpy()
        ,onTimeout      = jasmine.createSpy()
        ,onComplete     = jasmine.createSpy()
        
    var ajax = $.ajax('url', {
      onStart: onStart
      ,onStateChange: onStateChange
      ,onProgress: onProgress
      ,onAbort: onAbort
      ,onError: onError
      ,onSuccess: onSuccess
      ,onTimeout: onTimeout
      ,onComplete: onComplete
    })
    
    server.response({
      method: 'GET'
      ,url: 'url'
      ,responseText: 'ok'
    })
    
    expect(onStart).toHaveBeenCalled()
    expect(onStateChange).toHaveBeenCalled()
    expect(onProgress).toHaveBeenCalled()
    expect(onAbort).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
    expect(onSuccess).toHaveBeenCalled()
    expect(onTimeout).not.toHaveBeenCalled()
    expect(onComplete).toHaveBeenCalled()
  })
  
  it('responseType json', function() {
    var onSuccess = jasmine.createSpy()
    var response  = {foo: 1, bar: 'bar', baz: true}
    var ajax = $.ajax('url', {
      responseType: 'json'
      ,onSuccess: onSuccess
    })
    
    server.response({
      method: 'GET'
      ,url: 'url'
      ,responseText: JSON.stringify(response)
    })
    
    expect(onSuccess).toHaveBeenCalled()
    expect(onSuccess.calls[0].args[0]).toEqual(response)
  })
  
  it('responseType xml', function() {
    var onSuccess = jasmine.createSpy()
    var ajax = $.ajax('url', {
      responseType: 'xml'
      ,onSuccess: onSuccess
    })
    
    server.response({
      method: 'GET'
      ,url: 'url'
      ,response: Mock.createXML()
    })
    
    expect(onSuccess).toHaveBeenCalled()
    expect(onSuccess.calls[0].args[0] instanceof XMLDocument).toBeTruthy()
  })
  
  it('responseType document', function() {
    var onSuccess = jasmine.createSpy()

    var ajax = $.ajax('url', {
      responseType: 'document'
      ,onSuccess: onSuccess
    })
    
    server.response({
      method: 'GET'
      ,url: 'url'
      ,response: document.implementation.createHTMLDocument('')
    })
    
    expect(onSuccess).toHaveBeenCalled()
    expect(onSuccess.calls[0].args[0] instanceof HTMLDocument).toBeTruthy()
  })
  
  it('should throw an error with invalid responseType', function() {
    function request() {
      $.ajax('url', {responseType: 'invalidResponseType'})
    }
    expect(request).toThrow()
  })
  
  it('should throw an error when change responseType with synchronous request', function() {
    function request() {
      $.ajax('url', {responseType: 'invalidResponseType', async: false})
    }
    expect(request).toThrow()
  })
  
  it('response headers', function() {
    var responseHeaders = {
      'Content-Type': 'application/json'
    }
    var ajax = $.ajax('url')
    
    server.response({
      method: 'GET'
      ,url: 'url'
      ,responseText: 'ok'
      ,responseHeaders: responseHeaders
    })
    
    expect(ajax.getResponseHeader('Content-Type')).toEqual(responseHeaders['Content-Type'])
    
    var expectedAllResponseHeaders = []
    for (var i in responseHeaders) {
      expectedAllResponseHeaders.push(i + ': ' + responseHeaders[i])
    }
    expectedAllResponseHeaders = expectedAllResponseHeaders.join("\n")
    expect(ajax.getAllResponseHeaders()).toEqual(expectedAllResponseHeaders)
  })
  
  it('should abort request when onStart resturn false', function() {
    var onStart         = function() {return false}
        ,onStateChange  = jasmine.createSpy()
        ,onProgress     = jasmine.createSpy()
        ,onAbort        = jasmine.createSpy()
        ,onError        = jasmine.createSpy()
        ,onSuccess      = jasmine.createSpy()
        ,onTimeout      = jasmine.createSpy()
        ,onComplete     = jasmine.createSpy()
        
    var ajax = $.ajax('url', {
      onStart: onStart
      ,onStateChange: onStateChange
      ,onProgress: onProgress
      ,onAbort: onAbort
      ,onError: onError
      ,onSuccess: onSuccess
      ,onTimeout: onTimeout
      ,onComplete: onComplete
    })
    
    server.response({
      method: 'GET'
      ,url: 'url'
      ,responseText: 'ok'
    })
    
    expect(onStateChange).toHaveBeenCalled()
    expect(onProgress).toHaveBeenCalled()
    expect(onAbort).toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
    expect(onSuccess).toHaveBeenCalled()
    expect(onTimeout).not.toHaveBeenCalled()
    expect(onComplete).toHaveBeenCalled()
  })
  
  it('cannot call abort with synchronous request', function() {
    var onAbort = jasmine.createSpy()
    var ajax = $.ajax('url', {
      async: false
      ,onAbort: onAbort
    })
    
    ajax.abort()
    expect(onAbort).not.toHaveBeenCalled()
  })
  
  it('onError should called when server return 500', function() {
    var onError = jasmine.createSpy()
    ,ajax = $.ajax('url', {
      onError: onError
    })
    
    server.response({
      method: 'GET'
      ,url: 'url'
      ,status: 500
      ,statusText: 'Internal server error'
    })
    
    expect(onError).toHaveBeenCalled()
  })
  
  it('$.get', function() {
    var onSuccess = jasmine.createSpy()
        ,ajax = $.get('url', onSuccess)
        
    server.response({
      method: 'GET'
      ,url: 'url'
      ,responseText: 'ok'
    })
    
    expect(onSuccess).toHaveBeenCalled()
  })
  
  it('$.getJson', function() {
    var onSuccess = jasmine.createSpy()
        ,ajax = $.getJson('url', onSuccess)
        
    server.response({
      method: 'GET'
      ,url: 'url'
      ,responseText: '[]'
    })
    
    expect(onSuccess).toHaveBeenCalled()
  })
  
  xit('$.getJsonp', function() {
    
  })
  
  it('$.getXml', function() {
    var onSuccess = jasmine.createSpy()
        ,ajax = $.getXml('url', onSuccess)
        
    server.response({
      method: 'GET'
      ,url: 'url'
      ,response: Mock.createXML()
    })
    
    expect(onSuccess).toHaveBeenCalled()
    expect(onSuccess.calls[0].args[0] instanceof XMLDocument).toBeTruthy()
  })
  
  it('$.post', function() {
    var onSuccess = jasmine.createSpy()
        ,ajax = $.post('url', onSuccess)
        
    server.response({
      method: 'POST'
      ,url: 'url'
      ,response: 'ok'
    })
    
    expect(onSuccess).toHaveBeenCalled()
    expect(onSuccess.calls[0].args[0]).toEqual('ok')
  })
  
  xit('$.poll', function() {
    
  })
  
  it('$.ajax GET with data', function() {
    var data = {foo: 'foo', bar : 1, baz: true}
    var ajax = $.ajax({
      url: 'url'
      ,data: data
    })
    
    expect(ajax.url).toEqual($.appendQuery('url', data))
  })
  
  it('$.ajax POST with data', function() {
    var data = {foo: 'foo', bar : 1, baz: true}
    var ajax = $.ajax({
      method: 'POST'
      ,url: 'url'
      ,data: data
    })
    
    expect(ajax.url).toEqual('url')
  })
})
;
