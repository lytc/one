(function($) {
  var ajax = function(url, options) {
    if (!$.isString(url)) {
      options = url
    }
    
    if ($.isFunction(options)) {
      options = {success: options}
    }
    
    options || (options = {})
    if ($.isString(url)) {
      options.url = url
    }
    
    options.headers = $.extend({}, ajax.defaultOptions.baseHeaders, options.headers || {})
    
    options = $.extend({}, ajax.defaultOptions, options)
    
    var url = options.url
    
    if (false !== options.disableCaching) {
      url = $.appendQuery(url, function() {
        var params = {}
        params[options.disableCaching] = new Date().getTime()
        return params
      }())
    }
    
    options.method || (options.method = 'GET')
    options.method = options.method.toUpperCase()
    
    if (options.data && options.method == 'GET') {
      url = $.appendQuery(url, options.data)
      options.data = null
    }
    
    if (options.method == 'POST') {
      options.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    }
    
    var xhr = new XMLHttpRequest()
    
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        clearTimeout(timeoutId)
        var result, error = false
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
          var responseType = options.responseType || xhr.getResponseHeader('content-type')
              ,result
              ,error

          try {
            switch (responseType) {
              case 'application/json':
              case 'json':
                result = JSON.parse(xhr.responseText)
                break
              
              case 'application/xml':
              case 'text/xml':
              case 'xml':
                result = xhr.responseXML
                break
                
              case 'application/javascript':
              case 'text/javascript':
              case 'javascript':
              case 'script':
                result = eval(xhr.responseText)
                break
                
              default:
                result = xhr.responseText
            }
          } catch (e) { 
            error = e 
          }
        } else {
          error = xhr.status + ' ' + xhr.statusText
        }
        
        options.complete(xhr, options)
        
        if (error) {
          options.error(xhr, options)
          $.error(error)
        } else {
          options.success(result, xhr, options)
        }
      }
    }
    
    xhr.open(options.method, url, options.async)
    
    for (var name in options.headers) {
      xhr.setRequestHeader(name, options.headers[name])
    }
    
    if (false === options.before(xhr, options)) {
      xhr.abort()
      return false
    }
    
    var timeoutId
    if (options.timeout > 0) {
      timeoutId = setTimeout(function() {
        xhr.abort()
        $.error('ajax timeout')
      }, options.timeout)
    }
    
    xhr.send(options.data? $.param(options.data) : null)
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
      if ($.isObject(params)) {
        params = $.param(params)
      }
      return url += params
    }
    
    ,get: function(url, success, responseType) {
      var options = {
        url: url
        ,success: success
      }
      if (responseType) {
        options.responseType = responseType
      }
      return $.ajax(options)
    }
    
    ,getJson: function(url, success) {
      return $.get(url, success, 'json')
    }
    
    ,getXml: function(url, success) {
      return $.get(url, success, 'xml')
    }
    
    ,getScript: function(url, success) {
      return $.get(url, success, 'script')
    }
    
    ,post: function(url, data, success, responseType) {
      if ($.isFunction(data)) {
        responseType = success
        success = data
        data = null
      }
    
      var options = {
        url: url
        ,method: 'POST'
        ,data: data
        ,success: success
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
        options = {success: options}
      }
      
      if ($.isNumber(options)) {
        options = {delay: options}
      }
    
      options || (options = {})
      if ($.isString(url)) {
        options.url = url
      }
      
      var newOptions = $.extend({}, options)
      
      newOptions.success = function() {
        $(function(){
          $.ajax(newOptions)
        }).defer(options.delay || 1000)
      }
      
      if (options.success) {
        newOptions.success = $(newOptions.success).createInterceptor(options.success)
      }
      
      return $.ajax(newOptions)
    }
  })
  
  ajax.defaultOptions = {
    method: 'GET'
    ,timeout: 60000
    ,async: false
    ,baseHeaders: {
      'X-Requested-With': 'XMLHttpRequest'
    }
    ,data: null
    ,responseType: 'text'
    ,disableCaching: '_dc'
    ,before: $.noop
    ,complete: $.noop
    ,success: $.noop
    ,error: $.noop
  }
  
  $.ajax = ajax
})(one)
