(function ($) {
    "use strict"

    var xhrEvents = {
        readystatechange:   {alias:'StateChange'},
        loadstart:          {alias:'Start', cancelable:true},
        progress:           {alias:'Progress', cancelable:true},
        abort:              {alias:'Abort'},
        error:              {alias:'Error'},
        load:               {alias:'Success'},
        timeout:            {alias:'Timeout'},
        loadend:            {alias:'Complete'}
    }

    $.ajax = function (url, options) {
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

        var defaultOptions  = $.ajax.defaultOptions
            ,responseType   = options.responseType || defaultOptions.responseType

        var xhr = $.ajax.createXhr()
            ,processResponseData = function (xhr) {
                return xhr.response
            }
            ,isSuccess = function (xhr) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && xhr.protocol == 'file:')) {
                    return true
                }
                return false
            }

        // event listeners
        $.each(xhrEvents, function (eventName, eventOptions) {
            var alias = eventOptions.alias || eventName
                ,callback = options['on' + alias]

            if (callback) {
                xhr.addEventListener(eventName, function (e) {
                    if (e.type == 'load') {
                        if (isSuccess(this)) {
                            var result = processResponseData(this)
                            callback.call(this, result, e)
                        }
                    } else if (false === callback.call(this, e) && eventOptions.cancelable) {
                        this.abort()
                    }
                }, false)

                if (alias == 'Error' && callback) {
                    xhr.addEventListener('load', function (e) {
                        if (!isSuccess(this)) {
                            e.isServerError = true
                            callback.call(this, e)
                        }
                    }, false)
                }
            }

            var uploadCallback = options['on' + 'Upload' + alias]

            if (!uploadCallback) {
                return
            }

            xhr.upload.addEventListener(eventName, function (e) {
                if (e.type == 'load') {
                    if ((this.status >= 200 && this.status < 300) || this.status == 304 || (this.status == 0 && this.protocol == 'file:')) {

                    }
                    var result = processResponseData(this)
                    uploadCallback.call(this, result, e)
                } else if (false === uploadCallback.call(this, e) && eventOptions.cancelable) {
                    this.abort()
                }
            }, false)

            if (alias == 'Error' && uploadCallback) {
                xhr.upload.addEventListener('load', function (e) {
                    if (!isSuccess(this)) {
                        e.isServerError = true
                        uploadCallback.call(this, e)
                    }
                }, false)
            }
        })

        // request url
        url = options.url || defaultOptions.url
        var disableCaching = undefined !== options.disableCaching ? options.disableCaching : defaultOptions.disableCaching

        if (disableCaching) {
            url = $.appendQuery(url, function () {
                var params = {}
                params[disableCaching] = new Date().getTime()
                return params
            }())
        }

        // request method
        var method = options.method || defaultOptions.method

        // request data
        var data = options.data
        if (data && method == 'GET') {
            url = $.appendQuery(url, data)
            options.data = null
        } else if (method == 'POST' || method == 'PUT') {
            if ($.isPlainObject(data)) {
                options.data = JSON.stringify(data)
            } else if (data instanceof HTMLFormElement) {
                options.data = new FormData(options.data)
            }
        }

        // async
        var async = undefined !== options.async ? options.async : defaultOptions.async

        // open xhr
        xhr.open(method, url, async)

        // cross-origin request
        xhr.withCredentials = undefined !== options.withCredentials || defaultOptions.withCredentials

        // request timeout
        xhr.timeout = options.timeout || defaultOptions.timeout

        // responseType
        if (responseType) {
            switch (responseType) {
                case 'json':
                    processResponseData = function (xhr) {
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
        if (options.data && $.isPlainObject(options.data)) {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        }

        for (var i in defaultOptions.requestHeaders) {
            xhr.setRequestHeader(i, defaultOptions.requestHeaders[i])
        }

        if (options.headers) {
            for (var i in options.headers) {
                xhr.setRequestHeader(i, options.headers[i])
            }
        }

        // send
        xhr.send(options.data || null)

        return xhr
    }

    var escape = encodeURIComponent

    function serialize(params, obj, traditional, scope) {
        var array = $.isArray(obj)
        $.each(obj, function (key, value) {
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
        param: function (obj, traditional) {
            var params = []
            params.add = function (k, v) {
                this.push(escape(k) + '=' + escape(v))
            }
            serialize(params, obj, traditional)
            return params.join('&').replace('%20', '+')
        }

        ,appendQuery: function (url, params) {
            if (-1 == url.indexOf('?')) {
                url += '?'
            }

            if (params instanceof HTMLFormElement || params instanceof $.nodes) {
                params = $(params).val()
            }

            if ($.isObject(params)) {
                params = $.param(params)
            }

            url += params

            return url
        }

        ,get: function (url, onSuccess, responseType) {
            var options = {
                url: url
                ,onSuccess: onSuccess || $.noop
            }
            if (responseType) {
                options.responseType = responseType
            }

            return $.ajax(options)
        }

        ,getJson: function (url, onSuccess) {
            return $.get(url, onSuccess, 'json')
        }

        ,getXml: function (url, onSuccess) {
            return $.get(url, onSuccess, 'xml')
        }

        ,post: function (url, data, onSuccess, responseType) {
            if ($.isFunction(data)) {
                responseType = onSuccess
                onSuccess = data
                data = null
            }

            var options = {}

            if ($.isPlainObject(onSuccess)) {
                options = onSuccess
                onSuccess = null
            }

            options.url = url
            options.method = 'POST'
            options.data = data
            if (onSuccess) {
                options.onSuccess = onSuccess
            }

            if (responseType) {
                options.responseType = responseType
            }

            return $.ajax(options)
        }

        ,pool: function (url, options) {
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

            newOptions.onSuccess = function () {
                $(function () {
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
        method:                 'GET'
        ,url:                   '.'
        ,timeout:               60000
        ,async:                 true
        ,withCredentials:       false
        ,responseType:          ''
        ,disableCaching:        '_dc'
        ,requestHeaders: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    }

    $.ajax.createXhr = function () {
        return new XMLHttpRequest()
    }
})(one)