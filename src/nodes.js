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
            if ($.isString(name)) {
                var node = this[0]
                if (undefined === document.body.style[name.camelize(true)]) {
                    name = '-' + $.vendorPrefix + '-' + name
                }
                name = name.camelize(true)

                if (undefined === value && $.isString(name)) {
                    return node.style[name] || document.defaultView.getComputedStyle(node, '').getPropertyValue(name)
                }

                if (null === value) {
                    node.style[name] = null
                    return this
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

                if (undefined === document.body.style[property.camelize()]) {
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
})(one)