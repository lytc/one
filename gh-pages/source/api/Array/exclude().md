    Array.prototype.exclude(Mixed|Array items*) // => Array

~~~js
[1, 2, 3, 4, 5].exclude(1, 2, 4) // => [3, 5]
[1, 2, 3, 4, 5].exclude([1, 2, 4]) // => [3, 5]
[1, 2, 3, 4, 5].excluce(1, [2, 4]) // => [3, 5]
~~~