    val() => Object
    val(Object values) => self

~~~html
<form>
    <input type="hidden" name="id" value="1">
    <input type="text" name="email" value="prtran@gmail.com">
    <input type="checkbox" name="libs" value="1" checked="checked">
    <input type="checkbox" name="libs" value="2" checked="checked">
</form>
~~~

~~~js
$('form').val()
// => {id: "1", email: "prtran@gmail.com", libs: ["1", "2"]}
~~~

~~~js
$('form').val({id: "2", email: "anonymous@gmail.com", libs: ["2"])
~~~

~~~html
<form>
    <input type="hidden" name="id" value="2">
    <input type="text" name="email" value="anonymous@gmail.com">
    <input type="checkbox" name="libs" value="1">
    <input type="checkbox" name="libs" value="2" checked="checked">
</form>
~~~