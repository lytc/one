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
    
    if (false !== options.disableCaching) {
      options.url = $.appendQuery(options.url, function() {
        var params = {}
        params[options.disableCaching] = new Date().getTime()
        return params
      }())
    }
    
    options.method || (options.method = 'GET')
    options.method = options.method.toUpperCase()
    
    if (options.data && options.method == 'GET') {
      options.url = $.appendQuery(options.url, options.data)
      options.data = null
    }
    
    if (options.method == 'POST') {
      options.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    }
    
    var xhr = ajax.createXhr()
    
    xhr.onreadystatechange = function() {
      if (this.readyState == 4) {
        clearTimeout(timeoutId)
        var result, error = false
        if ((this.status >= 200 && this.status < 300) || this.status == 304 || (this.status == 0 && this.protocol == 'file:')) {
          var responseType = this.options.responseType || this.getResponseHeader('content-type')
              ,result
              ,error

          try {
            switch (responseType) {
              case 'application/json':
              case 'json':
                result = JSON.parse(this.responseText)
                break
              
              case 'application/xml':
              case 'text/xml':
              case 'xml':
                result = this.responseXML
                break
                
              case 'application/javascript':
              case 'text/javascript':
              case 'javascript':
              case 'script':
                result = eval(/^\((.*)\)$/.test(this.responseText)? this.responseText : '(' + this.responseText + ')')
                break
                
              default:
                result = this.responseText
            }
          } catch (e) { 
            error = e 
          }
        } else {
          error = this.status + ' ' + this.statusText
        }
        
        this.options.complete(this, options)
        
        if (error) {
          this.options.error(this, options)
          $.error(error)
        } else {
          this.options.success(result, this, options)
        }
      }
    }
    
    xhr.onabort = function() {
      this.options.complete(this, options)
      this.options.abort(this, options)
    }
    
    xhr.options = options
    
    xhr.open(options.method, options.url, options.async)
    
    for (var name in options.headers) {
      xhr.setRequestHeader(name, options.headers[name])
    }
    
    if (false === options.before(xhr, options)) {
      xhr.abort()
      return xhr
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
        ,success: success || $.noop
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
    url: '.'
    ,method: 'GET'
    ,timeout: 60000
    ,async: true
    ,baseHeaders: {
      'X-Requested-With': 'XMLHttpRequest'
    }
    ,data: null
    ,disableCaching: '_dc'
    ,before: $.noop
    ,complete: $.noop
    ,success: $.noop
    ,error: $.noop
    ,abort: $.noop
  }
  
  ajax.createXhr = function() {
    return new XMLHttpRequest()
  }
  
  $.ajax = ajax
})(one)