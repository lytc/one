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
})(one)