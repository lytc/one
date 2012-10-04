(function ($) {
    "use strict"

    $.fn = function (fn) {
        $.extend(fn, $.fn.fn)
        return fn
    }

    $.extend($.fn, {
        createAlias: function (obj, fnName) {
            return function () {
                return obj[fnName].apply(obj, arguments)
            }
        }
    })

    $.fn.fn = {
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

        ,createRepeated:function (interval) {
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

        ,defer: function (miliseconds) {
            var fn = this

            return setTimeout(function () {
                fn.call(this)
            }, miliseconds || 0)
        }
    }
})(one)