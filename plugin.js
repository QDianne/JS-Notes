/*
 * @Description: 自定义插件函数
 * @Version: 
 * @Author: 
 * @Date: 2021-04-04 16:10:00
 * @LastEditor: 
 * @LastEditTime: 2021-04-04 22:53:45
 */


if (!this.myPlugin) {
    this.myPlugin = {};
}


/**
 * @name: inherit 
 * @test: 函数继承
 * @msg: 使son函数的隐式原型是father函数的原型
 * @param {*} son
 * @param {*} father
 * @return {*}
 */
this.myPlugin.inherit = function(son, father) {

    son.prototype = Object.creat(father.prototype);
    //ES5以下没有Object.creat()方法，所以写法如下，功能一样
    // var Temp = function () {};
    // Temp.prototype = father.prototype;
    // son.prototype = new Temp();

    son.prototype.constructor = son;
    son.prototype.uber = father.prototype;
}


/**
 * @name: mixin
 * @test: 函数混合
 * @msg: 将obj2混合入obj1，返回新的混合对象，两个对象都不发生改变
 * @param {*object} obj1
 * @param {*object} obj2
 * @return {*object}
 */
this.myPlugin.mixin = function(obj1, obj2) {
    // 用对象的静态方法
    // 该方法后面混合前面，会改变前一个对象并返回的是前一个对象 
    // 所以在前面再传一个空对象，这样不改变原有对象，返回的是混合后的新对象
    // 
    return Object.assign({}, obj1, obj2);

    // 自己写的对象混合
    //
    // var obj = {};
    // //把obj2的属性复制到新对象
    // for (var prop in obj2) {
    //     obj[prop] = obj2[prop];
    // }
    // //将obj1里有，obj2里没有的加入新对象
    // for (var prop in obj1) {
    //     if (!(prop in obj2)) {
    //       obj[prop] = obj1[prop];
    //     }
    // }
    // return obj;
}


/**
 * @name: clone
 * @test: 克隆
 * @msg: 对象里的属性如果是对象，深度克隆对象地址要不同，浅度克隆指向地址相同
 * @param {*object}obj
 * @param {*boolean}deep
 * @return {*object}
 */
this.myPlugin.clone = function(obj, deep) {
    //数组
    if (Array.isArray(obj)) {

        if (deep) {
            // 深度克隆
            var newArr = [];
            for (var i = 0; i < obj.length; i++) {
                newArr.push(clone(obj[i], deep));
            }
            return newArr;
        } else {
            // 浅度克隆
            return obj.slice;
        }

        //对象
    } else if (typeof(obj) === "object") {

        var newObj = {};
        for (var prop in obj) {
            if (deep) {
                //深度克隆 
                newObj[prop] = this.clone(obj[prop], deep);
            } else {
                // 浅度克隆
                newObj[prop] = obj[prop];
            }
        }
        return newObj;

        //其他
    } else {

        return obj;

    }
}


/**
 * @name: debounce
 * @test: 函数防抖 给事件执行后延一段时间，如果在那段时间内再次触发事件，重新等待。
 * @msg: 调用函数返回函数用变量接着，事件内调用变量，变量调用可传参给callback。
 * @param {*function} callback
 * @param {*number} time
 * @return {*function}
 */
this.myPlugin.debounce = function(callback, time) {
    var timer;
    return function() {
        clearTimeout(timer);
        var args = arguments;
        timer = setTimeout(function() {
            callback.apply(null, args);
        }, time);
    }
}


/**
 * @name: throttleOne
 * @test: 函数节流 
 * @msg: 在一定时间段内，函数多次触发只执行一次。
 * @param {*function} callback
 * @param {*number} time
 * @param {*boolean} immediately
 * @return {*function}
 */
this.myPlugin.throttle = function(callback, time, immediately) {
    //先触发然后一段时间内不允许触发
    if (immediately) {
        var t;
        return function() {
            if (!t || Date.now() - t > time) {
                callback.apply(null, arguments);
                t = Date.now();
            }
        }
    } else {
        //先等待一段时间后触发
        var timer;
        return function() {
            if (timer) {
                return;
            }
            var args = arguments;
            timer = setTimeout(function() {
                callback.apply(null, args);
                timer = null;
            }, time);
        }
    }

}


/**
 * @name: pipe
 * @test: 函数管道
 * @msg: 调用时传参函数名，将多个函数按传参顺序依次调用，最后返回一个结果
 * @param {*function}
 * @return {*function} 
 */
this.myPlugin.pipe = function() {
    var args = Array.from(arguments);
    return function(val) {
        for (var i = 0; i < args.length; i++) {
            var func = args[i];
            val = func();
        }
        return val;
    }
}