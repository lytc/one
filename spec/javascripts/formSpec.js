describe('$.Node.form', function() {
  var form = $('<form>')
  
  form.append(
    '<input type="hidden" name="hidden1" />',
    '<input type="text" name="text1" />',
    '<input type="password" name="password1" />',
    '<input type="radio" name="radio1" value="radio1" />',
    '<input type="radio" name="radio1" value="radio2" />',
    '<input type="checkbox" name="checkbox1" value="checkbox1" />',
    '<input type="checkbox" name="checkbox1" value="checkbox2" />',
    '<select name="select1">\
      <option value="option1">option1</option>\
      <option value="option2">option1</option>\
    </select>',
    '<select name="select2" multiple>\
      <option value="option1">option1</option>\
      <option value="option2">option1</option>\
    </select>',
    '<textarea name="textarea1">abc</textarea>',
    '<input type="button" name="button1" />'
  )
  
  describe('val()', function() {
    it('val', function() {
      var val = {
        hidden1: 'hidden1'
        ,text1: 'text1'
        ,password1: 'password1'
        ,radio1: 'radio1'
        ,checkbox1: ['checkbox1']
        ,select1: 'option2'
        ,select2: ['option1', 'option2']
        ,textarea1: 'textarea1'
        ,button1: 'button1'
      }
      
      form.val(val)
      expect(form.val()).toEqual(val)
    })
  })
  
  describe('submit()', function() {
    it('submit()', function() {
      var success = jasmine.createSpy()
      var xhr = form.submit(success)
      xhr.response({
        status: 200
        ,responseText: 'ok'
      })
      expect(success).toHaveBeenCalled()
    })
  })
})