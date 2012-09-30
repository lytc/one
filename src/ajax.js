(function($) {
  var xhrEvents = {
    readystatechange: {alias: 'onStateChange'}, 
    loadstart: {alias: 'onStart', cancelable: true}, 
    progress: {alias: 'onProgess', cancelable: true}, 
    abort: {alias: 'onAbort'}, 
    error: {alias: 'onError'}, 
    load: {alias: 'onSuccess'},
    timeout: {alias: 'onTimeout'}, 
    loadend: {alias: 'onComplete'}
  }
  
  $.ajax = function(url, options) {
    if (!$.isString(url)) {
      options = url
    }
    
    if ($.isFunction(options)) {
      options = {onSuccess: options}
    }
    
    options || (options = {})
    
    if ($.isString(url)) {
      options.url = url
    }
    
    var defaultOptions = $.ajax.defaultOptions
        ,responseType = options.responseType || defaultOptions.responseType
        
    if ('jsonp' == responseType) {
      return this.getJsonp(options)
    }
    
    var xhr = $.ajax.createXhr()
        ,processResponseData = function(xhr) {
          return xhr.response
        }
    
    // event listeneners
    $.each(xhrEvents, function(eventName, eventOptions) {
      var alias = eventOptions.alias || eventName
          ,callback = options[alias]
      if (!callback) {
        return
      }
      
      xhr.addEventListener(eventName, function(e) {
        if (e.type == 'load') {
          var result = processResponseData(this)
          callback.call(this, result, e)
        } else if (false === callback.call(this, e) && eventOptions.cancelable) {
          this.abort()
        }
      }, false)
    })
    
    // request timeout
    xhr.timeout = options.timeout || defaultOptions.timeout
    
    // request url
    var url = options.url || defaultOptions.url
        ,disableCaching = undefined !== options.disableCaching? options.disableCaching : defaultOptions.disableCaching

    if (disableCaching) {
      url = $.appendQuery(url, function() {
        var params = {}
        params[disableCaching] = new Date().getTime()
        return params
      }())
    } 
    
    // request method
    var method = options.method || defaultOptions.method
    if (method == 'POST') {
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
    }
    
    // request data
    var data = options.data
    if (data && method == 'GET') {
      url = $.appendQuery(url, data)
      options.data = null
    }
    
    // async
    var async = undefined !== options.async? options.async : defaultOptions.async
    
    // open xhr
    xhr.open(method, url, async)
    
    // responseType
    if (responseType) {
        switch (responseType) {
          case 'json':
            processResponseData = function(xhr) {
              return JSON.parse(xhr.responseText)
            }
            break;
          
          case 'xml':
            responseType = 'document'
          
          case 'arraybuffer':
          case 'blob':
          case 'document':
          case 'text':
            xhr.responseType = responseType
            break;
          
          default:
            throw new Error('XMLHttpRequest doesn\'t support response type "' + responseType + '"')
        }
    }
    
    // request headers
    for (var i in defaultOptions.requestHeaders) {
      xhr.setRequestHeader(i, defaultOptions.requestHeaders[i])
    }
    
    if (options.headers) {
      for (var i in options.headers) {
        xhr.setRequestHeader(i, options.headers[i])
      }
    }
 
    // send
    xhr.send(options.data)
    
    return xhr
  }
  
  var escape = encodeURIComponent
  
  function serialize(params, obj, traditional, scope){
    var array = $.isArray(obj)
    $.each(obj, function(key, value) {
      if (scope) key = traditional ? scope : scope + '[' + (array ? '' : key) + ']'
      // handle data in serializeArray() format
      if (!scope && array) params.add(value.name, value.value)
      // recurse into nested objects
      else if (traditional ? $.isArray(value) : $.isObject(value))
        serialize(params, value, traditional, key)
      else params.add(key, value)
    })
  }
  
  $.extend($, {
    param: function(obj, traditional){
      var params = []
      params.add = function(k, v){ this.push(escape(k) + '=' + escape(v)) }
      serialize(params, obj, traditional)
      return params.join('&').replace('%20', '+')
    }
    
    ,appendQuery: function(url, params) {
      if (-1 == url.indexOf('?')) {
        url += '?'
      }
      
      if (params instanceof HTMLFormElement || params instanceof $.nodes) {
        params = $(params).val()
      }
      
      if ($.isObject(params)) {
        params = $.param(params)
      }
      
      return url += params
    }
    
    ,get: function(url, onSuccess, responseType) {
      var options = {
        url: url
        ,onSuccess: onSuccess || $.noop
      }
      if (responseType) {
        options.responseType = responseType
      }
      
      return $.ajax(options)
    }
    
    ,getJson: function(url, onSuccess) {
      return $.get(url, onSuccess, 'json')
    }
    
    ,getJsonp: function(url, onSuccess) {
      if (!$.isString(url)) {
        options = url
      } else {
        options = {url: url, onSuccess: onSuccess}
      }
      
      var callbackName = $.sequence('_jsonpCallback')
          ,script = $.createElement('script')
          
      window[callbackName] = function(response) {
        onSuccess(response)
        window[callbackName] = null
        $(script).destroy()
      }
      
      var params = {}
      params[options.callbackParamName || 'callback'] = callbackName
      options.url = $.appendQuery(options.url, params)              
      
      $('head').append(script) 
      script.src = options.url
      
      return script
    }
    
    ,getXml: function(url, onSuccess) {
      return $.get(url, onSuccess, 'xml')
    }
    
    ,getScript: function(url, onSuccess) {
      return $.get(url, onSuccess, 'script')
    }
    
    ,post: function(url, data, onSuccess, responseType) {
      if ($.isFunction(data)) {
        responseType = onSuccess
        onSuccess = data
        data = null
      }
    
      var options = {
        url: url
        ,method: 'POST'
        ,data: data
        ,onSuccess: onSuccess
      }
    
      if (responseType) {
        options.responseType = responseType
      }
    
      return $.ajax(options)
    }
    
    ,pool: function(url, options) {
      if (!$.isString(url)) {
        options = url
      }
    
      if ($.isFunction(options)) {
        options = {onSuccess: options}
      }
      
      if ($.isNumber(options)) {
        options = {delay: options}
      }
    
      options || (options = {})
      if ($.isString(url)) {
        options.url = url
      }
      
      var newOptions = $.extend({}, options)
      
      newOptions.onSuccess = function() {
        $(function(){
          $.ajax(newOptions)
        }).defer(options.delay || 1000)
      }
      
      if (options.onSuccess) {
        newOptions.onSuccess = $(newOptions.onSuccess).createInterceptor(options.onSuccess)
      }
      
      return $.ajax(newOptions)
    }
  })
  
  $.ajax.defaultOptions = {
    method: 'GET'
    ,url: '.'
    ,timeout: 60000
    ,async: true
    ,responseType: ''
    ,requestHeaders: {
      'X-Requested-With': 'XMLHttpRequest'
    }
    ,disableCaching: '_dc'
  }
  
  $.ajax.createXhr = function() {
    return new XMLHttpRequest()
  }
})(one)