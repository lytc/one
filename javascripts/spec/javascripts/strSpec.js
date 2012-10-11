describe('String.prototype', function() {
  it('camelize', function() {
    expect('ca me li ze'.camelize()).toEqual('caMeLiZe')
    expect('ca-me-li-ze'.camelize()).toEqual('caMeLiZe')
    expect('ca_me_li_ze'.camelize()).toEqual('caMeLiZe')
    expect('ca me-li_ze'.camelize()).toEqual('caMeLiZe')
  })
  
  it('underscore', function() {
    expect('un der sco re'.underscore()).toEqual('un_der_sco_re')
    expect('un-der-sco-re'.underscore()).toEqual('un_der_sco_re')
    expect('unDerScoRe'.underscore()).toEqual('un_der_sco_re')
    expect('un der-sco-Re'.underscore()).toEqual('un_der_sco_re')
  })
  
  it('dasherize', function() {
    expect('da she ri ze'.dasherize()).toEqual('da-she-ri-ze')
    expect('da_she_ri_ze'.dasherize()).toEqual('da-she-ri-ze')
    expect('daSheRiZe'.dasherize()).toEqual('da-she-ri-ze')
    expect('da she_riZe'.dasherize()).toEqual('da-she-ri-ze')
  })
  
  it('format', function() {
    expect('Hi {0}, welcome to {1} !'.format(['Lytc', '"One"']))
          .toEqual('Hi Lytc, welcome to "One" !')
          
    expect('Hi {name}, welcome to {lib} !'.format({name: 'Lytc', lib: '"One"'}))
          .toEqual('Hi Lytc, welcome to "One" !')
          
    expect('Hi [0], welcome to [1] !'.format(['Lytc', '"One"'], /\[([\w_\-]+)\]/g))
          .toEqual('Hi Lytc, welcome to "One" !')
  })
  
  it('escape', function() {
    expect('<div>" content \' &</div>'.escape()).toEqual('&lt;div&gt;&quot; content \&apos; &amp;&lt;/div&gt;')
  })
})
;
