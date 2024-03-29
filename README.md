# python eel + vue 教程


### eel打包命令
python -m eel [your_main_script] [your_web_folder]

python -m eel main.py /web


# eel如何结合vue开发
### 一、启动文件配置
```python
import eel
import sys
import platform

"""
原理是：
测试环境：
1、测试环境设置启动页面为vue的测试服务端口，然后将app设为None，
2、将端口和vue的public/index.html 中的eel.js绑定/
生产环境：
和正常的一样使用
"""
def start_eel(develop):
    """Start Eel with either production or development configuration."""
    if develop:
        directory = 'src'
        app = None
        page = {'port': 8080}
        eel_kwargs = dict(
            mode=app,
            host="localhost",
            port=9000,
        )
    else:
        directory = 'web'
        app = 'chrome'
        page = 'index.html'
        eel_kwargs = dict(
            mode=app,
            port=0,
            size=(1280, 800),
        )
    eel.init(directory)
    try:
        eel.start(page, **eel_kwargs)
    except EnvironmentError:
        # If Chrome isn't found, fallback to Microsoft Edge on Win10 or greater
        if sys.platform in ["win32", "win64"] and int(platform.release()) >= 10:
            eel.start(page, mode="edge", **eel_kwargs)
        else:
            raise

if __name__ == "__main__":
    print("Opening python...")
    start_eel(False)
```
### 二、VUE 的相关配置
1、vue-cli 生成的项目根目录创建vue.config.js
2、vue.config.js中配置：
（将导出目录设置到web中，否则可能eel无法调用web中js）
```js
const path = require('path');
module.exports = {
    // 是否生成map文件
    outputDir: "./web"
}
```
3、public/index.html中插入
```html
<%if(process.env.NODE_ENV === 'production'){ %>
<script type="text/javascript" src="/eel.js"></script>
<%}else{%>
<script type=text/javascript src="http://localhost:9000/eel.js"></script>
<script>
      window.eel.set_host("ws://localhost:9000");
</script>
<%}%>
```

### 三、使用方法参考eel的使用教程

##JS端调用python方法
1、python 中声明方法,通过@eel.expose注解导出
```python
import eel

# 导出方法到javascript
@eel.expose  
def say_hello_py(x):
    """Print message from JavaScript on app initialization, then call a JS function."""
    print("Hello from %s" % x)
    eel.say_hello_js("Python {from within say_hello_py()}!")
```
```js
// 调用方法 windows.eel.[方法名]
 windows.eel.say_hello_py("你好啊")
```
##Python端调用JS方法
```js
    // 声明方法
    function sayHelloJS(x) {
        console.log("Hello from " + x);
    }
        
    //导出方法到python
    // WARN: must use window.eel to keep parse-able eel.expose{...}
    window.eel.expose(sayHelloJS, "say_hello_js");
```
```python
 import eel
# 调用js方法 eel.[js方法名]
# 调用方法必须在eel.init()方法后面执行

 eel.say_hello_js(
        "Python World!"
    )  
```

## 原始参考项目，在他上面优化了开发和生产模式
https://github.com/AndersonZhangyq/Vue-EEL-framework
