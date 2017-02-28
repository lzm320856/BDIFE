function Observer(data) {
    this.data = data;
    this.makeObserver(data);
    this.eventBus = new PubSub();
}
//该方法就是给属性绑get/set
Observer.prototype.makeObserver = function (data) {
    if(typeof data !== "object"){
        throw "please input object!"
    }
    let val;
    //在对象中遍历，只能用for..in..但是这个方法会将原型链上的属性方法均会遍历
    //因此用Object.hasOwnProperty进行过滤，只保留自身对象上的
    for(let key in data){
        if(data.hasOwnProperty(key)){
            val = data[key];
            //如果还是引用类型，则迭代直至所有的属性均绑定了get/set
            if(typeof val === "object"){
                new Observer(val)
            }
            this.convert(key,val);
        }
    }
};
Observer.prototype.convert = function (key,val) {
    var that = this;
    Object.defineProperty(this.data,key,{
        enumerable:true,
        configurable:true,
        get:function () {
            console.log("你访问了" + key);
            return val;
        },
        set:function (newVal,func) {
            console.log("你设置了" + key + "新的值为" + newVal);
            if(newVal == val) return;
            if(typeof newVal == "object"){
                new Observer(newVal);
            }
            that.eventBus.emit(key,newVal);    //触发订阅
            val = newVal;
            return val;
        }
    })
};


//发布订阅模式，一个中间层（包括一个订阅接口，一个取消接口，一个发布接口）
function PubSub(){
    this.handlers = {};
}
PubSub.prototype.on = function (eventType,handler) {
    if (!(eventType in this.handlers)){
        this.handlers[eventType] = [];
    }
    this.handlers[eventType].push(handler);
    return this;
}
PubSub.prototype.emit = function (eventType) {
    if(!this.handlers[eventType]) return;
    var handlerArgs = [].slice.call(arguments,1);  //刨除eventType，保留其他参数
    for(var i = 0; i < this.handlers[eventType].length;i++){
        this.handlers[eventType][i].apply(this,handlerArgs);  //实际上等于func(..rest);
    }
    return this;
}
PubSub.prototype.off = function (eventType) {
    if(!(eventType in this.handlers)) return;
    delete this.handlers[eventType];
    return this;
}
Observer.prototype.$watch = function(attr, callback){
    this.eventBus.on(attr, callback);
};


let app1 = new Observer({
    name: 'youngwind',
    age: 25
});


// 你需要实现 $watch 这个 API
app1.$watch('age', function(age) {
    console.log(`我的年纪变了，现在已经是：${age}岁了`)
});

app1.data.age = 100; // 输出：'我的年纪变了，现在已经是100岁了'