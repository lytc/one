describe('$.arr', function() {
  it('pad', function() {
    expect($.arr([]).pad(3, 1).toArray()).toEqual([1, 1, 1])
    expect($.arr([2, 3]).pad(4, 1).toArray()).toEqual([2, 3, 1, 1])
  })
  
  it('padLeft', function() {
    expect($.arr([2, 3]).padLeft(4, 1).toArray()).toEqual([1, 1, 2, 3])
  })
  
  it('uniq', function() {
    expect($.arr([]).uniq().toArray()).toEqual([])
    expect($.arr([1, 2, 3]).uniq().toArray()).toEqual([1, 2, 3])
    expect($.arr([1, 2, 3, 1, 1, 2]).uniq().toArray()).toEqual([1, 2, 3])
  })
  
  it('truthy', function() {
    expect($.arr([]).truthy().toArray()).toEqual([])
    expect($.arr([1, false, true, null, '', undefined, 0, NaN]).truthy().toArray()).toEqual([1, true])
  })
  
  it('falsy', function() {
    expect($.arr([]).truthy().toArray()).toEqual([])
    expect($.arr([1, false, true, null, '', undefined, 0]).falsy().toArray()).toEqual([false, null, '', undefined, 0])
    expect(isNaN($.arr([1, NaN]).falsy().toArray()[0])).toBeTruthy()
  })
  
  it('exclude', function() {
    expect($.arr([]).exclude().toArray()).toEqual([])
    expect($.arr([1, 2, 3, 4]).exclude(1, 3).toArray()).toEqual([2, 4])
    expect($.arr([1, 2, 3, 4]).exclude([1, 3]).toArray()).toEqual([2, 4])
    expect($.arr([1, 2, 3, 4]).exclude(1, [3]).toArray()).toEqual([2, 4])
  })
})