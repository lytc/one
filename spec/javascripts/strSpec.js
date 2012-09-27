describe('$.str', function() {
  it('should be object type', function() {
    var str = 'this is it'
    str = $.str(str)
    expect($.isObject(str)).toBeTruthy()
    expect(str).toEqual('this is it')
  })
  
  it('camelize', function() {
    expect($.str('ca me li ze').camelize()).toEqual('caMeLiZe')
    expect($.str('ca-me-li-ze').camelize()).toEqual('caMeLiZe')
    expect($.str('ca_me_li_ze').camelize()).toEqual('caMeLiZe')
    expect($.str('ca me-li_ze').camelize()).toEqual('caMeLiZe')
  })
  
  it('underscore', function() {
    expect($.str('un der sco re').underscore()).toEqual('un_der_sco_re')
    expect($.str('un-der-sco-re').underscore()).toEqual('un_der_sco_re')
    expect($.str('unDerScoRe').underscore()).toEqual('un_der_sco_re')
    expect($.str('un der-sco-Re').underscore()).toEqual('un_der_sco_re')
  })
  
  it('dasherize', function() {
    expect($.str('da she ri ze').dasherize()).toEqual('da-she-ri-ze')
    expect($.str('da_she_ri_ze').dasherize()).toEqual('da-she-ri-ze')
    expect($.str('daSheRiZe').dasherize()).toEqual('da-she-ri-ze')
    expect($.str('da she_riZe').dasherize()).toEqual('da-she-ri-ze')
  })
  
  it('format', function() {
    expect($.str('Hi {0}, welcome to {1} !').format(['Lytc', '"One"']))
          .toEqual('Hi Lytc, welcome to "One" !')
          
    expect($.str('Hi {name}, welcome to {lib} !').format({name: 'Lytc', lib: '"One"'}))
          .toEqual('Hi Lytc, welcome to "One" !')
          
    expect($.str('Hi [0], welcome to [1] !').format(['Lytc', '"One"'], /\[([\w_\-]+)\]/g))
          .toEqual('Hi Lytc, welcome to "One" !')
  })
  
  it('escape', function() {
    expect($.str('<div>" content \' &</div>').escape()).toEqual('&lt;div&gt;&quot; content \&apos; &amp;&lt;/div&gt;')
  })
})