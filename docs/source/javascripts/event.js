(function($) {
  function init(eventName, selector) {
    this.listeners || (this.listeners = {})
    this.listeners[eventName] || (this.listeners[eventName] = [])
  }
  
  function initDomListener(eventName) {
    this.domListeners || (this.domListeners = {})
    if (!this.domListeners[eventName]) {
      var me = this
          ,callback = function(e) {
            me.trigger(eventName, e)
          }
      this.each(function() {
        this.addEventListener(eventName, callback, false)
      })
      this.domListeners[eventName] = callback
    }
  }
  
  $.extend($.NodeList.prototype, {
    on: function(eventName, selector, callback, limit) {
      init.call(this, eventName, selector)
      initDomListener.call(this, eventName)
      
      undefined !== limit || (limit = 0)
      
      if (undefined === callback) {
        callback = selector
        selector = undefined
      }
      
      this.listeners[eventName].push({selector: selector, callback: callback, limit: limit})
      return this
    }
    
    ,un: function(eventName, selector, callback) {
      if (!this.listeners || !this.listeners[eventName]) {
        return this
      }
      
      if ($.isFunction(selector)) {
        callback = selector
        selector = undefined
      }
      
      var me = this
      
      $.each(this.listeners[eventName], function(index, event, events) {
        if (this.selector === selector) {
          if (!callback || callback == this.callback) {
            events.splice(index, 1)
            if (!events.length) {
              me.each(function() {
                this.removeEventListener(eventName, me.domListeners[eventName], false)
              })
            }
          }
        }
      })
      
      return this
    }
    
    ,trigger: function(eventName, e, node) {
      if (!this.listeners || !this.listeners[eventName]) {
        return this
      }
      
      var me = this
          ,target = $(e.target)
      
      $.each(this.listeners[eventName], function(index, event) {
        if (event.selector && !target.is(event.selector)) {
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
    
    ,one: function(eventName, selector, callback) {
      return this.on(eventName, selector, callback, 1)
    }
  })
})(one)
