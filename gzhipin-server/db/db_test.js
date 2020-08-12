/*
使用 mongoose 操作 mongodb 的测试文件
    1. 连接数据库
        1.1. 引入 mongoose
        1.2. 连接指定数据库(URL 只有数据库是变化的)
        1.3. 获取连接对象
        1.4. 绑定连接完成的监听(用来提示连接成功)
    2. 得到对应特定集合的 Model
        2.1. 字义 Schema(描述文档结构)
        2.2. 定义 Model(与集合对应, 可以操作集合)
    3. 通过 Model 或其实例对集合数据进行 CRUD 操作
        3.1. 通过 Model 实例的 save()添加数据
        3.2. 通过 Model 的 find()/findOne()查询多个或一个数据
        3.3. 通过 Model 的 findByIdAndUpdate()更新某个数据
        3.4. 通过 Model 的 remove()删除匹配的数据
* */
// 1.1. 引入 mongoose
const mongoose = require('mongoose')
const md5 = require('blueimp-md5')
const url = 'mongodb://localhost:27017/gzhipin_test'
// 1.2.连接指定数据库(URL 只有数据库是变化的)
mongoose.connect(url,{useNewUrlParser: true,useUnifiedTopology: true},function (err,db) {
    if (err) throw err;
    console.log('数据库创建成功')
})
// 1.3. 获取连接对象
//const conn = mongoose.connection
// 1.4. 绑定连接完成的监听(用来提示连接成功)
// conn.on(('connected',function() {   //连接成功自动调用
//     console.log('数据库连接成功')
// }))
// 2. 得到对应特定集合的 Model
// 2.1. 字义 Schema(描述文档结构)
const userSchema = mongoose.Schema({
    username: {type: String, required: true}, // 用户名
    password: {type: String, required: true}, // 密码
    type: {type: String, required: true}, // 用户类型: user/boss
    header: {type:String}
})
// 2.2. 定义 Model(与集合对应, 可以操作集合)
const UserModel = mongoose.model('user', userSchema) // 集合名: users

// 3. 通过 Model 或其实例对集合数据进行 CRUD 操作
// 3.1. 通过 Model 实例的 save()添加数据
function testSave() {
    //创建UserModel实例
   const userModel = new UserModel({username: 'Tom', password: md5('123'), type:'user'})
    //调用save()保存
    userModel.save(function (err,userDoc) {
        console.log('save()',err,userDoc)
    })
}
//testSave()
// 3.2. 通过 Model .的 find()/findOne()查询多个或一个数据
function testFind() {
    //查询多个
    UserModel.find(function (err,users) {
        console.log('find()',err, users)
    })
    //查询一个,查询条件
    UserModel.findOne({username:'Tom'},function (err,user) {
            console.log('findOne()',err, user)
    })
}
//testFind()
// 3.3. 通过 Model 的 findByIdAndUpdate()更新某个数据
function testUpdate() {
    UserModel.findByIdAndUpdate({_id:'5f041396cceb693700c31804'},
        {username:'Jack'},function (err,oldUser) {
            console.log('testUpdate()',err ,oldUser)
        })
}
// testUpdate();
// 3.4. 通过 Model 的 remove()删除匹配的数据
function testDelete() {
    UserModel.deleteOne({_id:'5f041396cceb693700c31804'},function (err,doc) {
        console.log('testDelete()',err ,doc)
    })
}
//testDelete()

