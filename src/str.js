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

    var Str = function (str) {
        str = new String(str)
        $.extend(str, Str.fn)
        return str
    }

    Str.fn = {
        camelize: function () {
            return Str(this.replace(/[-_\s]+(.)?/g, function (match, c) {
                return c.toUpperCase()
            }))
        }

        ,underscore:function () {
            return Str(this.replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase())
        }

        ,dasherize:function () {
            return Str(this.replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase())
        }

        ,format:function (values, pattern) {
            pattern || (pattern = /\{([\w_\-]+)\}/g)

            return Str(this.replace(pattern, function (str, match) {
                return undefined == values[match] ? '' : values[match]
            }))
        }

        ,escape:function () {
            return Str(this.replace(/[&<>"']/g, function (m) {
                return '&' + escapeChars[m] + ';';
            }))
        }
    }

    $.str = Str
})(one)