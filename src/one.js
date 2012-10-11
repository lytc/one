/**
 * @class $
 */
one = (function () {
    "use strict"

    var slice = [].slice
        ,tmpNode

    /**
     * @method $
     * @param {String|Node|NodeList|HTMLCollection|Function} what
     * @param {Object} scope
     * @return {Nodes}
     */
    var $ = function (what, scope) {
        if (what instanceof $.nodes) {
            return what
        }

        if ($.isString(what)) {
            if (/\<\w+(.*)\>/.test(what)) {
                tmpNode || (tmpNode = $.createElement('div'))
                tmpNode.innerHTML = what
                what = tmpNode.childNodes
            } else {
                var parent = scope || document
                what = parent.querySelectorAll(what)
            }
        }

        if ($.isNode(what) || $.isNodeList(what) || $.isHtmlCollection(what) || $.isArray(what)) {
            return $.nodes(what)
        }
    }

    /**
     * @method isObject
     * @param {Mixed} o
     * @return {Boolean}
     */
    $.isObject = function (o) {
        return o instanceof Object
    }

    /**
     * @method isPlainObject
     * @param {Mixed} o
     * @return {Boolean}
     */
    $.isPlainObject = function (o) {
        if (!o || !$.isObject(o) || o.nodeType || o == o.window) {
            return false;
        }

        var hasOwn = Object.prototype.hasOwnProperty

        if (o.constructor && !hasOwn.call(o, 'constructor') && !hasOwn.call(o.constructor.prototype, 'isPrototypeOf')) {
            return false;
        }

        for (var key in o) {
        }

        return key === undefined || hasOwn.call(o, key);
    }

    /**
     * @method extend
     * @param {Object} target
     * @param {Object} sources*
     * @param {Boolean} [recursive=false]
     * @return {Object}
     */
    $.extend = function (target/*, sources*//*, recursive*/) {
        var sources = slice.call(arguments, 1)
            ,recursive = sources.pop()
            ,item

        if (recursive !== true) {
            sources.push(recursive)
        }

        if (!sources.length) {
            sources = target
            target = {}
            recursive = true
        }

        sources.forEach(function (source) {
            for (var key in source) {
                item = source[key]
                if (recursive && $.isPlainObject(item)) {
                    target[key] = $.extend({}, item, true)
                } else {
                    if (source.hasOwnProperty(key)) {
                        target[key] = item
                    }
                }
            }
        })
        return target
    }

    $.extend($, {
        /**
         * @attribute noop
         * @readOnly
         * @type Function
         */
        noop: function () {
        }

        /**
         * @method sequence
         * @param {String} [prefix]
         * @return {String}
         */
        ,sequence: function () {
            var counter = 0
            var counterPrefixes = {}

            return function (prefix) {
                if (!prefix) {
                    return counter++
                }

                counterPrefixes[prefix] || (counterPrefixes[prefix] = 0)
                return (prefix ? prefix : '') + counterPrefixes[prefix]++
            }
        }()

        /**
         * @method error
         * @param {String} message
         * @return {Error}
         */
        ,error: function (message) {
            return new Error(message)
        }

        /**
         * @method getType
         * @param {Mixed} obj
         * @return String
         */
        ,getType: function (o) {
            return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1]
        }

        /**
         * @method isString
         * @param {Mixed} obj
         * @return {Boolean}
         */
        ,isString: function (o) {
            return typeof o == 'string'
        }

        /**
         * @method isNumber
         * @param {Mixed} obj
         * @return {Boolean}
         */
        ,isNumber: function (o) {
            return typeof o == 'number'
        }

        /**
         * @method isFunction
         * @param {Mixed} obj
         * @return {Boolean}
         */
        ,isFunction: function (o) {
            return typeof o == 'function'
        }

        /**
         * @method isArray
         * @param {Mixed} obj
         * @return {Boolean}
         */
        ,isArray: function (o) {
            return o instanceof Array
        }


        /**
         * @method isLikeArray
         * @param {Mixed} obj
         * @return {Boolean}
         */
        ,isLikeArray: function (o) {
            if (!o) {
                return false
            }

            return $.isArray(o)
                || $.isNodeList(o)
                || $.isHtmlCollection(o)
                || o instanceof DOMTokenList
                || o instanceof FileList
                || $.getType(o) == 'Arguments'
        }

        /**
         * @method isNode
         * @param {Mixed} obj
         * @return {Boolean}
         */
        ,isNode: function (o) {
            return o instanceof Node
        }

        /**
         * @method isElement
         * @param {Mixed} obj
         * @return {Boolean}
         */
        ,isElement: function (o) {
            return o instanceof Element
        }

        /**
         * @method isTextNode
         * @param {Mixed} obj
         * @return {Boolean}
         */
        ,isTextNode: function (o) {
            return o instanceof Text
        }

        /**
         * @method isNodeList
         * @param {Mixed} obj
         * @return {Boolean}
         */
        ,isNodeList: function (o) {
            return o instanceof NodeList || /* opera bug? */ $.getType(o) == 'NodeList'
        }

        /**
         * @method isHtmlCollection
         * @param {Mixed} obj
         * @return {Boolean}
         */
        ,isHtmlCollection: function (o) {
            return o instanceof HTMLCollection
        }

        /**
         * @method isDefined
         * @param {Mixed} what
         * @param {Object} [context=window]
         * @return {Boolean}
         */
        ,isDefined: function (what, context) {
            context || (context = window)
            if ($.isString(what) && /\./.test(what)) {
                var parts = what.split('.')
                    , tmp = context
                for (var i = 0, len = parts.length; i < len; ++i) {
                    if (undefined === tmp[parts[i]]) {
                        return false
                    }
                    tmp = tmp[parts[i]]
                }
            } else {
                return context[what] === undefined
            }

            return true
        }

        /**
         * @method each
         * @param {Object|Array|LikeArray} obj
         * @param {Function} callback
         * @return {Mixed}
         */
        ,each: function (o, callback) {
            var result

            if ($.isLikeArray(o)) {
                for (var i = 0, len = o.length; i < len; ++i) {
                    result = o[i]
                    if (false === callback.call(result, i, result, o)) {
                        break
                    }
                }
            } else {
                for (var i in o) {
                    result = o[i]
                    if (false === callback.call(result, i, result, o)) {
                        break
                    }
                }
            }

            return result
        }

        /**
         * @method map
         * @param {Object|Array|LikeArray} obj
         * @param {Function} callback
         * @return {Mixed}
         */
        ,map: function (o, callback) {
            var result

            if ($.isLikeArray(o)) {
                result = []
                for (var i = 0, len = o.length; i < len; ++i) {
                    result.push(callback.call(o[i], i, o[i], o))
                }
            } else {
                result = {}
                for (var i in o) {
                    result[i] = callback.call(o[i], i, o[i], o)
                }
            }
            return result
        }

        /**
         * @method namespace
         * @param {String} names
         * @param {Object} [scope=window]
         * @return {Object}
         */
        ,namespace: function (names, scope) {
            var parts = names.split('.')
                ,i = 0
                ,len = parts.length
                ,tmp = scope || window
                ,part

            for (; i < len; ++i) {
                part = parts[i]
                tmp[part] || (tmp[part] = {})
                tmp = tmp[part]
            }

            return tmp
        }

        /**
         * @method createAlias
         * @static
         * @param {Object} obj
         * @param {String} fnName
         * @return {Function}
         */
        ,createAlias: function (obj, fnName) {
            return function () {
                return obj[fnName].apply(obj, arguments)
            }
        }

        /**
         * @method createElement
         * @param {String} name
         * @param {Object} [property]
         * @return {HTMLElement}
         */
        ,createElement: function (name, properties) {
            if ($.isPlainObject(name)) {
                properties = name
                name = undefined
            }

            name || (name = 'div')
            var dom = document.createElement(name)

            properties || (properties = {})

            if (properties.html) {
                dom.innerHTML = properties.html
                delete properties.html
            }

            if (properties.cls) {
                dom.className = properties.cls
                delete properties.cls
            }

            for (var property in properties) {
                dom.setAttribute(property, properties[property])
            }

            document.createDocumentFragment().appendChild(dom)
            return dom
        }

        /**
         * @method toArray
         * @param {Mixed} obj
         * @return {Array}
         */
        ,toArray: function (o) {
            if (!$.isLikeArray(o)) {
                return [].slice.call(arguments)
            }

            return [].slice.call(o)
        }

        /**
         * @method ready
         * @param {Function} callback
         */
        ,ready: function () {
            var isReady = document.readyState == 'complete'
                , callbacks = []

            document.addEventListener('DOMContentLoaded', function () {
                isReady = true
                for (var i = 0, len = callbacks.length; i < len; ++i) {
                    callbacks[i]()
                }
            }, false)

            return function (callback) {
                if (isReady) {
                    return callback()
                }

                callbacks.push(callback)
                return $
            }
        }()

        /**
         * @method query
         * @param {String} selector
         * @param {HTMLElement} [root=document]
         * @return {NodeList}
         */
        ,query: function (selector, root) {
            root || (root = document)

            switch (selector[0]) {
                case '>':
                case '+':
                case '~':
                    if (!root.id) {
                        var id = $.sequence('id-')
                        root.id = id
                    }

                    selector = '#' + root.id + selector

                    var nodes = document.querySelectorAll(selector)
                    !id || root.removeAttribute('id')
                    return nodes

                case '-':
                    var index = $(root).index()
                        ,parent = root.parentNode
                    return $.query(selector.substr(1) + ':nth-child(' + index + ')', parent)

                case '<':
                    if (selector[1] == '~') {
                        var index = $(root).index()
                            ,nodes = $.query(selector.substr(2), root.parentNode)
                            ,result = []

                        for (var i = 0, len = nodes.length; i < len; ++i) {
                            if ($(nodes[i]).index() >= index) {
                                break
                            }
                            result.push(nodes[i])
                        }
                        return result
                    }
                    break;

                default:
                    return root.querySelectorAll(selector)
            }
        }

        /**
         * @method getJsonP
         * @param {String} url
         * @param {Function} onSuccess
         * @return {HTMLScriptEleemnt}
         */
        ,getJsonP: function (url, onSuccess) {
            var options

            if (!$.isString(url)) {
                options = url
            } else {
                options = {url:url, onSuccess:onSuccess}
            }

            var callbackName = $.sequence('_jsonpCallback')
                ,script = $.createElement('script')

            window[callbackName] = function (response) {
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
    })

    var ua = navigator.userAgent
        ,test = function (regex) {
            return regex.test(ua)
        }
        ,isWebkit   = test(/webkit/i)
        ,isFirefox  = test(/firefox/i)
        ,isChrome   = test(/chrome/i)
        ,isSafari   = !isChrome && test(/sarafi/i)
        ,isOpera    = test(/opera/i)
        ,isIe       = test(/msie/i)
        ,isIphone   = test(/iphone/i)

    $.extend($, {
        /**
         * @attribute isFirefox
         * @readOnly
         * @type {Boolean}
         */
        isFirefox:isFirefox

        /**
         * @attribute isWebkit
         * @readOnly
         * @type {Boolean}
         */
        ,isWebkit:isWebkit

        /**
         * @attribute isChrome
         * @readOnly
         * @type {Boolean}
         */
        ,isChrome:isChrome

        /**
         * @attribute isSafari
         * @readOnly
         * @type {Boolean}
         */
        ,isSafari:isSafari

        /**
         * @attribute isOpera
         * @readOnly
         * @type {Boolean}
         */
        ,isOpera:isOpera

        /**
         * @attribute isIe
         * @readOnly
         * @type {Boolean}
         */
        ,isIe:isIe

        /**
         * @method vendorPrefix
         * @return {String}
         */
        ,vendorPrefix:function () {
            return  isFirefox ? 'moz' :
                    isWebkit ? 'webkit' :
                    isOpera ? 'o' :
                    isIe ? 'ms' : ''
        }()
    })

    return $
})()
window.$ || (window.$ = one)
