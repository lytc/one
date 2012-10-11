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
})(one)