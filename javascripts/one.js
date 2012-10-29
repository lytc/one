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
;
(function($) {
    "use strict"

    $.supports = {
        dataset: !!document.documentElement.dataset
    }
})(one);
/**
 * @class str
 */
(function ($) {
    "use strict"

    var escapeChars = {
        lt:'<',
        gt:'>',
        quot:'"',
        apos:"'",
        amp:'&'
    }

    for (var key in escapeChars) escapeChars[escapeChars[key]] = key;

    $.extend(String.prototype, {
        /**
         * @method camelize
         * @return {String}
         */
        camelize: function (lowerFirst) {
            var result = this.replace(/[-_\s]+(.)?/g, function (match, c) {
                return c.toUpperCase()
            })

            if (lowerFirst) {
                result = result[0].toLowerCase() + result.substr(1)
            }
            return result
        }

        /**
         * @method underscore
         * @return {String}
         */
        ,underscore:function () {
            return this.replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase()
        }

        /**
         * @method dasherize
         * @return {String}
         */
        ,dasherize:function () {
            return this.replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase()
        }

        /**
         * @method format
         * @param {Array|Object} values
         * @param {RegExp} [pattern=/\{([\w_\-]+)\}/g]
         * @return {String}
         */
        ,format:function (values, pattern) {
            pattern || (pattern = /\{([\w_\-]+)\}/g)

            return this.replace(pattern, function (str, match) {
                return undefined == values[match] ? '' : values[match]
            })
        }

        /**
         * @method escape
         * @return {String}
         */
        ,escape:function () {
            return this.replace(/[&<>"']/g, function (m) {
                return '&' + escapeChars[m] + ';';
            })
        }
    })
})(one);
/**
 * @class arr
 */
(function ($) {
    "use strict"

    $.extend(Array.prototype, {
        /**
         * @method pad
         * @param {Int} size
         * @param {Mixed} value
         * @return {Array}
         */
        pad: function (size, value) {
            var result = this

            if (size > 0) {
                for (var i = 0, len = size - result.length; i < len; ++i) {
                    result.push(value)
                }
            } else {
                for (var i = 0, len = -size - result.length; i < len; ++i) {
                    result.unshift(value)
                }
            }

            return result
        }

        /**
         * @method padLEft
         * @param {Int} size
         * @param {Mixed} value
         * @return {Array}
         */
        ,padLeft: function (size, value) {
            return this.pad(-size, value)
        }

        /**
         * @method uniq
         * @return {Array}
         */
        ,uniq: function () {
            return this.filter(function(item, i, me) {
                return i == me.indexOf(item)
            })
        }

        /**
         * @method truthy
         * @return {Array}
         */
        ,truthy: function () {
            return this.filter(function (item) {
                return !!item
            })
        }

        /**
         * @method falsy
         * @return {Array}
         */
        ,falsy: function () {
            return this.filter(function (item) {
                return !item
            })
        }

        /**
         * @method exclude
         * @param {Mixed|Array} items*
         * @return {Array}
         */
        ,exclude: function () {
            var arg, index, result = this

            for (var i = 0, len = arguments.length; i < len; ++i) {
                arg = $.isArray(arguments[i]) ? arguments[i] : [arguments[i]]
                for (var j = 0, jlen = arg.length; j < jlen; ++j) {
                    if (-1 != (index = result.indexOf(arg[j]))) {
                        result.splice(index, 1)
                    }
                }
            }

            return result
        }
    })
})(one);
/**
 * @class fn
 */
(function ($) {
    "use strict"

    $.extend(Function.prototype,  {
        /**
         * @method createBuffered
         * @param {Int} buffer
         * @return {Function}
         */
        createBuffered: function (buffer) {
            var timeoutId
                ,fn = this

            return function () {
                var me = this
                    ,args = arguments

                !timeoutId || clearTimeout(timeoutId)
                timeoutId = setTimeout(function () {
                    fn.apply(me, args)
                }, buffer)
            }
        }

        /**
         * @method createRepeated
         * @param {Int} interval
         * @return {Function}
         */
        ,createRepeated: function (interval) {
            var intervalId
                ,fn = this
                ,result = function () {
                    var me = this
                        ,args = arguments

                    return intervalId = setInterval(function () {
                        fn.apply(me, args)
                    }, interval)
                }

            result.stop = function () {
                clearInterval(intervalId)
            }

            return result
        }

        /**
         * @method createInterceptor
         * @param {Function} passedFn
         * @return {Function}
         */
        ,createInterceptor: function (passedFn) {
            var fn = this
            return function () {
                var me = this
                    ,args = arguments

                if (false !== passedFn.apply(me, args)) {
                    return fn.apply(me, args)
                }
                return false
            }
        }

        /**
         * @method defer
         * @param {Int} miliseconds
         * @return {Int}
         */
        ,defer: function (miliseconds) {
            var fn = this

            return setTimeout(function () {
                fn.call(this)
            }, miliseconds)
        }
    })
})(one);
(function ($) {
    "use strict"

    var flattenArgs = function (args, useSpace) {
        var a = []
            ,_a

        for (var i = 0; i < args.length; ++i) {
            _a = args[i]
            if (!$.isArray(_a)) {
                if (useSpace) {
                    _a = _a.trim().replace(/\s+/g, ' ').split(' ')
                } else {
                    _a = [_a]
                }
            }
            a = a.concat(_a)
        }
        return a
    }

    var Nodes = function (nodes) {
        nodes || (nodes = [])
        nodes = $.toArray(nodes)

        $.extend(nodes, Nodes.fn)
        return nodes
    }

    Nodes.fn = {
        index: function () {
            if (!this[0]) {
                return -1
            }

            return [].indexOf.call(this[0].parentNode.children, this[0])
        }

        ,get: function (index, acceptTextNode) {
            var nodes = this

            if (!acceptTextNode) {
                nodes = this.filter(function () {
                    return !$.isTextNode(this)
                })
            }

            index > -1 || (index = nodes.length + index)

            return nodes[index]
        }

        ,item: function (index, acceptTextNode) {
            return Nodes(this.get(index, acceptTextNode))
        }

        ,first: function (acceptTextNode) {
            return this.item(0, acceptTextNode)
        }

        ,last: function (acceptTextNode) {
            return this.item(-1, acceptTextNode)
        }

        ,each: function (callback) {
            this.forEach(function (node, index, nodes) {
                return callback.call(node, index, nodes, node)
            })

            return this
        }

        ,filter: function (callback) {
            var result = []

            this.forEach(function (node, index, nodes) {
                if (callback.call(node, index, nodes, node)) {
                    result.push(node)
                }
            })

            return Nodes(result)
        }

        ,matches: function (selector) {
            return this.filter(function () {
                return this[$.vendorPrefix ? $.vendorPrefix + 'MatchesSelector' : 'matchesSelector'](selector)
            })
        }

        ,is: function (what) {
            if ($.isString(what)) {
                return !!this.matches(what).length
            }

            if ($.isElement(what)) {
                what = [what]
            }

            if ($.isLikeArray(what)) {
                for (var i = 0, len = what.length; i < len; ++i) {
                    if (-1 != this.indexOf(what[i])) {
                        return true
                    }
                }
            }

            return false
        }

        ,ancestors: function (level, selector) {
            if ($.isString(level)) {
                selector = level
                level = 1
            }

            undefined !== level || (level = 1)

            var nodes = []
                ,count
                ,parent

            this.each(function () {
                count = level
                parent = this

                while (count != 0) {
                    parent = parent.parentNode
                    if (!parent) {
                        return
                    }
                    count--
                }

                if (selector) {
                    if ($(parent).is(selector)) {
                        nodes.push(parent)
                    }
                } else {
                    nodes.push(parent)
                }
            })

            return Nodes(nodes)
        }

        ,parent: function (selector) {
            return this.ancestors(selector)
        }

        ,find: function (selector) {
            selector || (selector = '*')
            var nodes = []

            this.each(function () {
                [].forEach.call($.query(selector, this), function (n) {
                    nodes.push(n)
                })
            })

            return Nodes(nodes)
        }

        ,children: function (selector) {
            selector || (selector = '*')
            return this.find('>' + selector)
        }

        ,next: function (selector) {
            selector || (selector = '*')
            return this.find('+' + selector)
        }

        ,prev: function (selector) {
            selector || (selector = '*')
            return this.find('-> ' + selector)
        }

        ,nextSiblings: function (selector) {
            selector || (selector = '*')
            return this.find('~' + selector)
        }

        ,prevSiblings: function (selector) {
            selector || (selector = '*')
            return this.find('<~>' + selector)
        }

        ,append: function () {
            var args = flattenArgs(arguments)
                ,i
                ,len = args.length
                ,item

            for (i = 0; i < len; ++i) {
                item = args[i]
                if ($.isString(item)) {
                    this.each(function () {
                        this.innerHTML += item
                    })
                } else {
                    this.each(function () {
                        var node = this
                        $(item).each(function () {
                            var child = this
                            node.appendChild(child)
                        })
                    })
                }
            }

            return this
        }

        ,prepend: function (what) {
            if ($.isString(what)) {
                this.each(function () {
                    this.innerHTML = what + this.innerHTML
                })
            } else {
                this.each(function () {
                    var node = this
                        ,children = $(what)

                    children.reverse()

                    $(children).each(function () {
                        var child = this
                        node.insertBefore(child, node.firstChild)
                    })
                })
            }

            return this
        }

        ,before: function (el) {
            var node
                ,nodes

            this.each(function () {
                node = this
                nodes = $(el)

                nodes.each(function () {
                    node.parentNode.insertBefore(this, node)
                })
            })

            return this
        }

        ,after: function (el) {
            var node
                ,nodes

            this.each(function () {
                node = this
                nodes = $(el)
                nodes.reverse()
                nodes.each(function () {
                    node.parentNode.insertBefore(this, node.nextSibling)
                })
            })

            return this
        }

        ,clone: function () {
            var node

            return $.map(this, function () {
                node = this.cloneNode(true)
                node.removeAttribute('id')
                return node
            })
        }

        ,concat: function () {
            var me = this

            $.each(arguments, function (index, item) {
                me.push.apply(me, $.toArray($(item)))
            })

            return this
        }

        ,wrap: function (el) {
            el || (el = '<div>')

            this.each(function () {
                $(el).first().append(this)
            })

            return this
        }

        ,unwrap: function () {
            var parent

            this.each(function () {
                parent = this.parentNode
                if (!parent || !parent.parentNode) {
                    return
                }
                $(parent.childNodes).each(function () {
                    $(parent).before(this)
                })
                $(parent).destroy()
            })

            return this
        }

        ,destroy: function () {
            this.each(function () {
                for (var i in this) {
                    delete this[i]
                }

                if (this.parentNode) {
                    this.parentNode.removeChild(this)
                }
            })
        }

        ,html: function (html) {
            if (undefined === html) {
                if (this[0]) {
                    return this[0].innerHTML
                }
            } else {
                this.each(function () {
                    this.innerHTML = html
                })
            }

            return this
        }

        ,data: function (name, value) {
            if (!this[0]) {
                return
            }

            if (undefined === value && $.isString(name)) {
                if ($.supports.dataset) {
                    return this[0].dataset[name]
                }
                return this.attr('data-' + name)
            }

            if ($.isString(name)) {
                var tmp = {}
                tmp[name] = value
                name = tmp
            }

            if ($.supports.dataset) {
                this.each(function () {
                    for (var i in name) {
                        this.dataset[i] = name[i]
                    }
                })
            } else {
                this.each(function () {
                    for (var i in name) {
                        $(this).attr('data-' + i, name[i])
                    }
                })
            }

            return this
        }

        ,attr: function (name, value) {
            if (!this[0]) {
                return
            }
            if (undefined === value && $.isString(name)) {
                return this[0].getAttribute(name)
            }

            if ($.isString(name)) {
                var tmp = {}
                tmp[name] = value
                name = tmp
            }

            this.each(function () {
                for (var i in name) {
                    this.setAttribute(i, name[i])
                }
            })

            return this
        }

        ,hasAttr: function (name) {
            var node = this[0]

            if (!node) {
                return
            }

            var attrs = flattenArgs(arguments)
                ,i = 0
                ,len = attrs.length

            for (; i < len; ++i) {
                if (!node.hasAttribute(attrs[i])) {
                    return false
                }
            }

            return true
        }

        ,removeAttr: function (name) {
            var attrs = flattenArgs(arguments)
                ,i
                ,len = attrs.length

            this.each(function () {
                for (i = 0; i < len; ++i) {
                    this.removeAttribute(attrs[i])
                }
            })

            return this
        }

        ,hasClass: function () {
            var cls = flattenArgs(arguments, true)
                ,result = true
                ,i
                ,len = cls.length

            this.each(function () {
                for (i = 0; i < len; ++i) {
                    if (!this.classList.contains(cls[i])) {
                        return result = false
                    }
                }
            })

            return result
        }

        ,addClass: function () {
            var cls = flattenArgs(arguments, true)
                ,i
                ,len = cls.length

            this.each(function () {
                for (i = 0; i < len; ++i) {
                    this.classList.add(cls[i])
                }
            })

            return this
        }

        ,removeClass: function () {
            var cls = flattenArgs(arguments, true)
                ,i
                ,len = cls.length

            this.each(function () {
                for (i = 0; i < len; ++i) {
                    this.classList.remove(cls[i])
                }
            })

            return this
        }

        ,toggleClass: function () {
            var cls = flattenArgs(arguments, true)
                ,i
                ,len = cls.length

            this.each(function () {
                for (i = 0; i < len; ++i) {
                    this.classList.toggle(cls[i])
                }
            })
            return this
        }

        ,css: function (name, value) {
            if ($.isString(name) && (undefined === value || null === value)) {

                if (undefined === document.body.style[name.camelize()]) {
                    name = '-' + $.vendorPrefix + '-' + name
                }

                name = name.camelize()

                if (undefined === value) {
                    return this[0].style[name] // || document.defaultView.getComputedStyle(node, '').getPropertyValue(name)
                }

                if (null === value) {
                    this.each(function() {
                        this.style[name] = null
                    })
                }
            }

            !$.isString(name) || function () {
                var tmp = {}
                tmp[name] = value
                name = tmp
            }()

            var css = []
                ,property

            for (var i in name) {
                property = i.underscore().dasherize()

                if (undefined === document.body.style[property.camelize(true)]) {
                    property = '-' + $.vendorPrefix + '-' + property
                }

                css.push(property + ':' + name[i])
            }
            css = css.join(';')

            this.each(function () {
                this.style.cssText += ';' + css
            })

            return this
        }

        ,width: function (width) {
            if (undefined === width) {
                if (!this[0]) {
                    return
                }

                var result = this[0].clientWidth

                if (!result) {
                    result = parseFloat(this.css('width'))
                    if (isNaN(result)) {
                        result = 0
                    }
                }

                return result
            } else {
                if ($.isNumber(width)) {
                    width += 'px'
                }

                this.each(function () {
                    this.style.width = width
                })
            }

            return this
        }

        ,height: function (height) {
            if (undefined === height) {
                if (!this[0]) {
                    return
                }

                var result = this[0].clientHeight

                if (!result) {
                    result = parseFloat(this.css('height'))
                    if (isNaN(result)) {
                        result = 0
                    }
                }

                return result
            } else {
                if ($.isNumber(height)) {
                    height += 'px'
                }

                this.each(function () {
                    this.style.height = height
                })
            }

            return this
        }

        ,top: function (top) {
            if (undefined === top) {
                if (!this[0]) {
                    return
                }

                var result = this[0].clientTop

                if (!result) {
                    result = parseFloat(this.css('top'))
                    if (isNaN(result)) {
                        result = 0
                    }
                }

                return result
            } else {
                if ($.isNumber(top)) {
                    top += 'px'
                }

                this.each(function () {
                    this.style.top = top
                })
            }
            return this
        }

        ,left: function (left) {
            if (undefined === left) {
                if (!this[0]) {
                    return
                }

                var result = this[0].clientLeft

                if (!result) {
                    result = parseFloat(this.css('left'))
                    if (isNaN(result)) {
                        result = 0
                    }
                }

                return result
            } else {
                if ($.isNumber(left)) {
                    left += 'px'
                }

                this.each(function () {
                    this.style.left = left
                })
            }
            return this
        }

        ,offset: function (offset) {
            if (undefined === offset) {
                return {
                    width:this.width(), height:this.height(), top:this.top(), left:this.left()
                }
            } else {
                ['width', 'height', 'top', 'left'].forEach(function (item, index) {
                    if (undefined !== offset[item]) {
                        this[item](offset[item])
                    }
                }, this)
            }
            return this
        }
    }

    $.nodes = Nodes
})(one);
(function ($) {
    "use strict"

    function init(eventName) {
        this.listeners || (this.listeners = {})
        this.listeners[eventName] || (this.listeners[eventName] = [])
    }

    function initDomListener(eventName) {
        this.domListeners || (this.domListeners = {})

        if (!this.domListeners[eventName]) {
            var me = this
                ,callback = function (e) {
                    me.trigger(eventName, e, this)
                }

            this.each(function () {
                this.addEventListener(eventName, callback, false)
            })

            this.domListeners[eventName] = callback
        }
    }

    $.extend($.nodes.fn, {
        on: function (eventName, selector, callback, limit) {
            init.call(this, eventName, selector)
            initDomListener.call(this, eventName)

            undefined !== limit || (limit = 0)

            if (undefined === callback) {
                callback = selector
                selector = undefined
            }

            this.listeners[eventName].push({selector:selector, callback:callback, limit:limit})

            return this
        }

        ,un: function (eventName, selector, callback) {
            if (!this.listeners || !this.listeners[eventName]) {
                return this
            }

            if ($.isFunction(selector)) {
                callback = selector
                selector = undefined
            }

            var me = this
                ,event
                ,events  = this.listeners[eventName]

            for (var i = 0; i < events.length; ++i) {
                event = events[i]

                if (event.selector === selector) {
                    if (!callback || callback == event.callback) {
                        events.splice(i, 1)
                        if (!events.length) {
                            this.each(function () {
                                this.removeEventListener(eventName, me.domListeners[eventName], false)
                            })
                        }
                    }
                }
            }

            return this
        }

        ,trigger: function (eventName, e, node) {
            if (!this.listeners || !this.listeners[eventName]) {
                return this
            }

            if (!node) {
                e instanceof Event || (e = new CustomEvent(eventName, e))
                this.each(function() {
                    this.dispatchEvent(e)
                })
                return this
            }

            var me = this
                ,target = e.target

            $.each(this.listeners[eventName], function (index, event) {
                if (event.selector && !$(target).is(event.selector)) {
                    return
                }
                event.callback.call(target, e, node)

                event.limit--

                if (0 == event.limit) {
                    me.un(eventName, event.selector, event.callback)
                }
            })

            return this
        }

        ,one: function (eventName, selector, callback) {
            return this.on(eventName, selector, callback, 1)
        }
    })
})(one);
/**
 * @class ajax
 */
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

    /**
     * @method ajax
     * @param {String} url
     * @param {Object} options
     * @return {XMLHttpRequest}
     */
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
        /**
         * @method param
         * @param {Object} obj
         * @param {Boolean} [traditional=false]
         * @return {String}
         */
        param: function (obj, traditional) {
            var params = []
            params.add = function (k, v) {
                this.push(escape(k) + '=' + escape(v))
            }
            serialize(params, obj, traditional)
            return params.join('&').replace('%20', '+')
        }

        /**
         * @method appendQuery
         * @param {String} url
         * @param {String|Object|HTMLFormElement} params
         * @return {String}
         */
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

        /**
         * @method get
         * @param {String} url
         * @param {Function|Object} onSuccess
         * @param {String} [responseType]
         * @return {XMLHttpRequest}
         */
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

        /**
         * @method getJson
         * @param {String} url
         * @param {Function|Object} onSuccess
         * @return {XMLHttpRequest}
         */
        ,getJson: function (url, onSuccess) {
            return $.get(url, onSuccess, 'json')
        }

        /**
         * @method getXml
         * @param {String} url
         * @param {Function|Object} onSuccess
         * @return {XMLHttpRequest}
         */
        ,getXml: function (url, onSuccess) {
            return $.get(url, onSuccess, 'xml')
        }

        /**
         * @method post
         * @param {String} url
         * @param {Function|Object} onSuccess
         * @param {String} [responseType]
         * @return {XMLHttpRequest}
         */
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

        /**
         * @method pool
         * @param {String} url
         * @param {Object|Function} [options]
         * @return {XMLHttpRequest}
         */
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

    /**
     * @attribute defaultOptions
     * @type {Object}
     * @default {
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
     */
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
})(one);
(function ($) {
    "use strict"

    $.extend($.nodes.fn, {
        val: function (value, reset) {
            if (undefined === value) {
                var node = this[0]

                if (!node) {
                    return
                }

                if (node.multiple) {
                    var options = node.options
                        ,value = []

                    for (var i = 0, len = options.length; i < len; ++i) {
                        if (options[i].selected) {
                            value.push(options[i].value)
                        }
                    }
                    return value.length ? value : undefined
                }

                if ('FORM' == node.nodeName) {
                    var value = {}
                        ,n

                    $(node.elements).each(function () {
                        n = $(this)
                        if ((this.type == 'radio' || this.type == 'checkbox') && !this.checked) {
                            return
                        }
                        if (this.type === 'checkbox') {
                            if (value[this.name]) {
                                value[this.name].push(n.val())
                            } else {
                                value[this.name] = [n.val()]
                            }
                        } else {
                            value[this.name] = n.val()
                        }
                    })

                    return value
                }

                return node.value
            } else {
                this.each(function () {
                    var node = this

                    if (node.multiple) {
                        var options = node.options
                        $.isArray(value) || (value = [value])

                        for (var i = 0, len = value.length; i < len; ++i) {
                            value[i] = value[i] + ''
                        }

                        for (var i = 0, len = options.length; i < len; ++i) {
                            options[i].selected = -1 != value.indexOf(options[i].value)
                        }
                    } else if ('FORM' == node.nodeName) {
                        $(node.elements).each(function () {
                            n = $(this)
                            if (undefined !== value[this.name]) {
                                n.val(value[this.name])
                            } else if (reset) {
                                n.val('')
                            }
                        })
                    } else {
                        switch (node.type) {
                            case 'checkbox':
                                $.isArray(value) || (value = [value])
                                node.checked = -1 != value.indexOf(node.value)
                                break;

                            case 'radio':
                                node.checked = $(node).val() == value + ''
                                break;

                            default:
                                node.value = value
                        }
                    }
                })
            }

            return this
        }

        ,submit: function (options) {
            if (!this[0] || this[0].nodeName != 'FORM') {
                return this
            }

            options || (options = {})

            if ($.isFunction(options)) {
                options = {onSuccess:options}
            }

            var ajaxOptions = {
                url:this.action || '.', method:this.method || 'GET', data:this.first().val()
            }

            $.extend(ajaxOptions, options)
            return $.ajax(ajaxOptions)
        }
    })
})(one);
(function ($) {
    "use strict"

    var compile = function(me) {
        if (me.compiledFn) {
            return me
        }

        var escapes = {
            '\\':'\\',
            "'":"'",
            r:'\r',
            n:'\n',
            t:'\t',
            u2028:'\u2028',
            u2029:'\u2029'
        };

        for (var key in escapes) escapes[escapes[key]] = key
        var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g
        var unescaper = /\\(\\|'|r|n|t|u2028|u2029)/g

        var unescape = function (code) {
            return code.replace(unescaper, function (match, escape) {
                return escapes[escape];
            })
        };

        var source = '';

        source += "var _t=''; _t+='" + me.template
            .replace(escaper, function (match) {
                return '\\' + escapes[match]
            })
            .replace(me.exprRegex, function (match, code) {
                return "'+\n(" + unescape(code) + ")+\n'"
            })
            .replace(me.evaluateRegex, function (match, code) {
                return "';\n" + unescape(code) + "\n;_t+='"
            })
            + "';\nreturn _t;\n"

        me.compiledFn = new Function(source)
        return me.compiledFn
    }

    var Template = function () {
        if (arguments.length) {
            this.setTemplate.apply(this, arguments)
        }
    }

    $.extend(Template.prototype, {
        evaluateRegex:  /<%([\s\S]+?)%>/g
        ,exprRegex:     /<%=([\s\S]+?)%>/g

        ,setTemplate: function () {
            var args = [], arg

            for (var i = 0, len = arguments.length; i < len; ++i) {
                arg = $.isLikeArray(arguments[i]) ? arguments[i] : [arguments[i]]
                args = args.concat(arg)
            }

            this.template = args.join('')
            this.compiledFn = null

            return this
        }

        ,render: function (data) {
            $.extend(data, Template.helpers)
            return compile(this).bind(data)()
        }
    })

    Template.helpers = {
        escape: function (str) {
            return str.escape() + ''
        }
    }
    $.Template = Template

    $.template = function () {
        var tpl = new Template()
            ,data = [].pop.call(arguments)

        if ($.isPlainObject(data)) {
            tpl.setTemplate.apply(tpl, arguments)
            return tpl.render(data)
        }

        [].push.call(arguments, data)
        tpl.setTemplate.apply(tpl, arguments)

        return tpl;
    }
})(one);
(function ($) {
    "use strict"

    var transitionEndEventName = $.isFirefox? 'transitionend' : $.vendorPrefix + 'TransitionEnd'

    $.extend($.nodes.fn, {
        transit: function (properties, duration, easing, callback) {
            var node = this[0]
            if (!node) {
                return this
            }
            node.fxQueue || (node.fxQueue = [])

            if (node.isFxPlaying) {
                node.fxQueue.push([properties, duration, easing, callback])
                return this
            }

            node.isFxPlaying = true

            var options = {}

            if ($.isPlainObject(duration)) {
                options = duration
            } else {
                if ($.isFunction(duration)) {
                    callback = duration
                    duration = undefined
                }
                !duration || (options.duration = duration)
                !easing || (options.easing = easing)
                !callback || (options.callback = callback)
            }

            options = $.extend({
                duration:1, easing:'ease', delay:0
            }, options)

            var me = this
            this.one(transitionEndEventName, function (e) {
                !options.callback || options.callback.call(e.target, e, me)

                node.isFxPlaying = false
                var args = node.fxQueue.shift()
                if (args) {
                    me.transit.apply(me, args)
                }
            })

            var keys = Object.keys(properties)
                ,len = keys.length

            var transitionProperty = keys.join()
                ,transitionDuration = [].pad(len, options.duration + 's')
                ,transitionTimingFunction = [].pad(len, options.easing)
                ,transitionDelay = [].pad(len, options.delay + 's')
                ,fixFirefox = false
                ,has = properties.hasOwnProperty.bind(properties)
                ,hasLeft = has('left')
                ,hasTop = has('top')
                ,hasRight = has('right')
                ,hasBottom = has('bottom')
                ,hasWidth = has('width')
                ,hasHeight = has('height')

            this.each(function () {
                var el = $(this)
                    ,value
                    ,matches
                    ,newValue
                    ,originalSize

                for (var i in properties) {
                    if (-1 != ['width', 'height', 'left', 'top', 'right', 'bottom'].indexOf(i)) {
                        value = properties[i]
                            , matches = ('' + value).match(/^(\+|\-|\*|\/)=(\d+)/)

                        if (matches) {
                            originalSize = parseFloat(el.css(i))
                            !isNaN(originalSize) || (originalSize = 0)

                            newValue = parseFloat(matches[2])

                            switch (matches[1]) {
                                case '+':
                                    value = originalSize + newValue
                                    break;

                                case '-':
                                    value = originalSize - newValue
                                    break;

                                case '*':
                                    value = originalSize * newValue
                                    break;

                                case '/':
                                    value = originalSize / newValue
                                    break;
                            }
                        }

                        properties[i] = $.isNumber(value) ? value + 'px' : value
                    }
                }

                if ($.isFirefox && (el.css('left') == 'auto' || el.css('top') == 'auto')) {
                    fixFirefox = true
                    el.css({
                        left: 0 + 'px'
                        ,top: 0 + 'px'
                    })
                }

                if ((hasLeft || hasTop || hasRight || hasBottom)
                    && (-1 == ['relative', 'absolute', 'fixed'].indexOf(el.css('position')))) {
                    el.css('position', 'relative')
                }

                if (hasWidth || hasHeight) {
                    el.css('overflow', 'hidden')
                }

                el.css({
                    transitionProperty:         transitionProperty
                    ,transitionDuration:        transitionDuration
                    ,transitionTimingFunction:  transitionTimingFunction
                    ,transitionDelay:           transitionDelay
                })

                if (fixFirefox) {
                    (function() {
                        el.css(properties)
                    }).defer(10)
                } else {
                    el.css(properties)
                }
            })

            return this
        }

        ,show: function (options) {
            if ($.isFunction(options)) {
                options = {callback:options}
            } else if ($.isNumber(options)) {
                options = {duration:options}
            } else if (true === options) {
                options = {}
            }

            if (undefined === options) {
                this.css({
                    display:'inherit', opacity:1
                })
            } else {
                this.transit({opacity:1}, options)
            }

            return this
        }

        ,hide: function (options) {
            if ($.isFunction(options)) {
                options = {callback: options}
            } else if ($.isNumber(options)) {
                options = {duration: options}
            } else if (true === options) {
                options = {}
            }

            if (undefined === options) {
                this.css('display', 'none')
            } else {
                options || (options = {})

                options.callback || (options.callback = $.noop)
                options.callback = options.callback.createInterceptor(function() {
                    $(this).css('display', 'none')
                })
                this.transit({opacity: 0}, options)
            }

            return this
        }

        ,toggle: function (options) {
            this.each(function () {
                var el = $(this)
                el[el.css('display') == 'none' || el.css('opacity') == 0 ? 'show' : 'hide'](options)
            })
            return this
        }

        ,slideUp: function (options) {
            this.each(function () {
                var el = $(this)
                this.originalHeight = el.css('height')
                el.transit({height:0}, options)
            })
            return this
        }

        ,slideDown: function (options) {
            this.each(function () {
                if (!this.originalHeight) {
                    return
                }

                $(this).transit({height:this.originalHeight}, options)
                this.originalHeight = undefined
            })
            return this
        }

        ,slideLeft: function (options) {
            this.each(function () {
                var el = $(this)
                this.originalWidth = el.css('width')
                el.transit({width:0}, options)
            })
            return this
        }

        ,slideRight: function (options) {
            this.each(function () {
                if (!this.originalWidth) {
                    return
                }

                $(this).transit({width:this.originalWidth}, options)
                this.originalWidth = undefined
            })
            return this
        }

        ,slideV: function (options) {
            this.each(function () {
                $(this)[this.originalHeight ? 'slideDown' : 'slideUp'](options)
            })
            return this
        }

        ,slideH: function (options) {
            this.each(function () {
                $(this)[this.originalWidth ? 'slideRight' : 'slideLeft'](options)
            })
            return this
        }

        ,collapse: function (options) {
            this.each(function () {
                var el = $(this)
                this.originalHeight = el.css('height')
                this.originalWidth = el.css('width')
                el.transit({height:0, width:0}, options)
            })
            return this
        }

        ,expand: function (options) {
            this.each(function () {
                if (!this.originalHeight && !this.originalWidth) {
                    return
                }

                $(this).transit({height:this.originalHeight, width:this.originalWidth}, options)
                this.originalHeight = undefined
                this.originalWidth = undefined
            })
            return this
        }

        ,toggleCollapse: function (options) {
            this.each(function () {
                $(this)[this.originalHeight && this.originalWidth ? 'expand' : 'collapse'](options)
            })
            return this
        }

        ,moveX: function (x, options) {
            return this.transit({
                left: x
            }, options)
        }

        ,moveY: function (y, options) {
            return this.transit({
                top:y
            }, options)
        }

        ,move: function (x, y, options) {
            return this.transit({
                left: x
                ,top: y
            }, options)
        }
    })
})(one);
