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
})(one)