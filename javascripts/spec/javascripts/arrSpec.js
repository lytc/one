describe('Array.prototype', function() {
  it('pad', function() {
    expect([].pad(3, 1)).toEqual([1, 1, 1])
    expect([2, 3].pad(4, 1)).toEqual([2, 3, 1, 1])
  })
  
  it('padLeft', function() {
    expect([2, 3].padLeft(4, 1)).toEqual([1, 1, 2, 3])
  })
  
  it('uniq', function() {
    expect([].uniq()).toEqual([])
    expect([1, 2, 3].uniq()).toEqual([1, 2, 3])
    expect([1, 2, 3, 1, 1, 2].uniq()).toEqual([1, 2, 3])
  })
  
  it('truthy', function() {
    expect([].truthy()).toEqual([])
    expect([1, false, true, null, '', undefined, 0, NaN].truthy()).toEqual([1, true])
  })
  
  it('falsy', function() {
    expect([].truthy()).toEqual([])
    expect([1, false, true, null, '', undefined, 0].falsy()).toEqual([false, null, '', undefined, 0])
    expect(isNaN([1, NaN].falsy()[0])).toBeTruthy()
  })
  
  it('exclude', function() {
    expect([].exclude()).toEqual([])
    expect([1, 2, 3, 4].exclude(1, 3)).toEqual([2, 4])
    expect([1, 2, 3, 4].exclude([1, 3])).toEqual([2, 4])
    expect([1, 2, 3, 4].exclude(1, [3])).toEqual([2, 4])
  })
})
;
