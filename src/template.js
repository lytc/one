(function ($) {
    "use strict"

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

        ,compile: function () {
            if (this.compiledFn) {
                return this;
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

            source += "var _t=''; _t+='" + this.template
                .replace(escaper, function (match) {
                    return '\\' + escapes[match]
                })
                .replace(this.exprRegex, function (match, code) {
                    return "'+\n(" + unescape(code) + ")+\n'"
                })
                .replace(this.evaluateRegex, function (match, code) {
                    return "';\n" + unescape(code) + "\n;_t+='"
                })
                + "';\nreturn _t;\n"

            this.compiledFn = new Function(source)
            return this
        }

        ,render: function (data) {
            this.compile()
            $.extend(data, Template.helpers)

            return this.compiledFn.bind(data)()
        }
    })

    Template.helpers = {
        escape: function (str) {
            return $.str(str).escape() + ''
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