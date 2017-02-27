function Observer(data) {
    this.data = data;
    this.walk(data)
}
Observer.prototype.walk = function (data) {
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
    Object.defineProperty(this.data,key,{
        enumerable:true,
        configurable:true,
        get:function () {
            console.log("你访问了" + key);
            return val;
        },
        set:function (newVal) {
            console.log("你设置了" + key + "新的值为" + newVal);
            if(newVal == val) return;
            val = newVal;
        }
    })
};
let data = {
    user:{
        name:"god",
        age:"24"
    },
    address:{
        city:"beijing"
    }
};
let app = new Observer(data);