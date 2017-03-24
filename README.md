# personalLib
storage of usual studies and resource。

——eval-test.html
eval-test.html 是一个学习eval()执行上下文的test case。eval()
描述：eval（）函数接受一个字符串，并执行字符串中的代码。
     eg：eval("3 + 4"); // 7
         var foo;
         eval("foo = 'heihei';"); // foo = 'heihei';
         
返回值：如果参数不是一个字符串，那么将参数返回。否则返回字符串中执行完成之后的返回值，如果没有返回值，则返回undefined。
需要注意的是，eval()接收的参数必须是字符串。如果是new String()生成的，则返回字符串本身，而不执行里面的内容。


问题：eval(）执行的作用域时什么，以及执行的context是什么。 结论


结论：eval()执行的时候，会开辟自己的执行空间，在其中定义的变量将在val执行结束之后销毁。 调用eval()相当于调用（{}();所以eval()可以访问到父级作用域。同时需要注意的是，eval执行时的this是eval被生命时的作用域。如果在外部eval赋值给了一个变量，在函数体里使用该变量。那么执行时的this将是全局作用域，而非局部作用域。
