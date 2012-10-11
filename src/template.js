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
})(one)