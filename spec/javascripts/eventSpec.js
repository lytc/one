describe('$.nodes event', function() {
    it('tracks that addEventListener was called', function() {
        var node = document.createElement('div')
            ,nodes = $(node)

        spyOn(nodes[0], 'addEventListener')

        nodes.on('click', $.noop)
        nodes.on('click', $.noop)

        expect(node.addEventListener).toHaveBeenCalled()
        expect(node.addEventListener.calls.length).toEqual(1)
    })


    it('tracks that removeEventListener was called', function() {
        var node = document.createElement('div')
            ,nodes = $(node)

        spyOn(nodes[0], 'removeEventListener')

        nodes.on('click', $.noop)
        nodes.on('click', $.noop)

        nodes.un('click', $.noop)
        expect(node.removeEventListener).not.toHaveBeenCalled()

        nodes.un('click', $.noop)
        expect(node.removeEventListener).toHaveBeenCalled()
        expect(node.removeEventListener.calls.length).toEqual(1)
    })

    it('tracks that removeEventListener was called with matches selector', function() {
        var node = document.createElement('div')
            ,nodes = $(node)

        spyOn(nodes[0], 'removeEventListener')

        nodes.on('click', '.foo', $.noop)
        nodes.un('click', '.foo', $.noop)

        expect(node.removeEventListener).toHaveBeenCalled()
        expect(node.removeEventListener.calls.length).toEqual(1)
    })

    it('tracks that removeEventListeners was\'t called when not matches callback', function() {
        var node = document.createElement('div')
            ,nodes = $(node)

        spyOn(nodes[0], 'removeEventListener')

        nodes.on('click', $.noop)
        nodes.un('click', function() {})
        expect(node.removeEventListener).not.toHaveBeenCalled()
    })

    it('tracks that removeEventListeners was\'t called when not matches selector', function() {
        var node = document.createElement('div')
            ,nodes = $(node)

        spyOn(nodes[0], 'removeEventListener')

        nodes.on('click', '.foo', $.noop)
        nodes.un('click', '.bar', $.noop)
        expect(node.removeEventListener).not.toHaveBeenCalled()
    })

    it('tracks its number of calls with $.nodes.one', function() {
        var node = document.createElement('div')
            ,nodes = $(node)
            ,callback = jasmine.createSpy()

        var e = {target: node}

        nodes.one('click', callback)
        nodes.trigger('click', e, node)
        nodes.trigger('click', e, node)

        expect(callback).toHaveBeenCalled()
        expect(callback.calls.length).toEqual(1)
    })

    it('should work with selector', function() {
        var node = document.createElement('div')
            ,child = document.createElement('div')
            ,nodes = $(node)
            ,e = {target: child}
            ,callback = jasmine.createSpy()

        child.className = 'foo'
        node.appendChild(child)

        nodes.on('click', '.foo', callback)
        nodes.trigger('click', e, node)

        expect(callback).toHaveBeenCalled()
        expect(callback.calls.length).toEqual(1)
    })
})