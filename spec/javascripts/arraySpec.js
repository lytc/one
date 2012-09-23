describe('$.arr', function() {
  it('pad', function() {
    expect($.arr([]).pad(3, 1).toArray()).toEqual([1, 1, 1])
    expect($.arr([2, 3]).pad(4, 1).toArray()).toEqual([2, 3, 1, 1])
  })
  it('padLeft', function() {
    expect($.arr([2, 3]).padLeft(4, 1).toArray()).toEqual([1, 1, 2, 3])
  })
})