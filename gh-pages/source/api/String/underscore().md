    String.prototype.underscore() => String
    
~~~js
'un der sco re'.underscore() // => 'un_der_sco_re'
'un-der-sco-re'.underscore() // => 'un_der_sco_re'
'unDerScoRe'.underscore() // => 'un_der_sco_re'
'un der-sco-Re'.underscore() // => 'un_der_sco_re'
~~~