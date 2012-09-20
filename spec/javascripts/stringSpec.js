describe('$.str', function() {
  it('should be object type', function() {
    var str = 'this is it'
    str = $.str(str)
    expect($.isObject(str)).toBeTruthy()
    expect(str + '').toBe('this is it')
  })
  
  it('$.str.camelize', function() {
    expect($.str('ca me li ze').camelize() + '').toEqual('caMeLiZe')
    expect($.str('ca-me-li-ze').camelize() + '').toEqual('caMeLiZe')
    expect($.str('ca_me_li_ze').camelize() + '').toEqual('caMeLiZe')
    expect($.str('ca me-li_ze').camelize() + '').toEqual('caMeLiZe')
  })
  
  it('$.str.underscore', function() {
    expect($.str('un der sco re').underscore() + '').toEqual('un_der_sco_re')
    expect($.str('un-der-sco-re').underscore() + '').toEqual('un_der_sco_re')
    expect($.str('unDerScoRe').underscore() + '').toEqual('un_der_sco_re')
    expect($.str('un der-sco-Re').underscore() + '').toEqual('un_der_sco_re')
  })
  
  it('$.str.dasherize', function() {
    expect($.str('da she ri ze').dasherize() + '').toEqual('da-she-ri-ze')
    expect($.str('da_she_ri_ze').dasherize() + '').toEqual('da-she-ri-ze')
    expect($.str('daSheRiZe').dasherize() + '').toEqual('da-she-ri-ze')
    expect($.str('da she_riZe').dasherize() + '').toEqual('da-she-ri-ze')
  })
})