const express = require('express')
const router = express.Router()
const md5 = require('blueimp-md5')
const cookieParser = require("cookie-parser");
express().use(cookieParser())

const { UserModel,ChatModel } = require('../db/models')

const filter = { password: 0, __v: 0 } //指定过滤的属性，返回的数据中这两个不要

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' })
})
// 解决跨域请求
router.all("*",function(req,res,next){
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin",'http://localhost:3000');
    res.header("Access-Control-Allow-Credentials", "true");
    //允许的header类型
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options')
        res.sendStatus(200)//让options尝试请求快速结束
    else
        next();
})

// 提供一个用户注册的接口
// a) path 为: /register
// b) 请求方式为: POST
// c) 接收 username 和 password 参数
// d) admin 是已注册用户
// e) 注册成功返回:
// {code: 0, data: {_id: 'abc', username: ‘xxx’, password:’123’}
// f) 注册失败返回: {code: 1, msg: '此用户已存在'}

/*
 *   1、获取请求参数
 *   2、处理
 *   3、返回响应参数
 * */
router.post('/register', function (req, res) {
    const { username, password, type } = req.body
    UserModel.findOne({ username }, function (err, user) {
        // 如果user有值
        if (user) {
            res.send({ code: 1, msg: '此用户已存在' })
        } else {
            //没有此用户则保存到数据库
            new UserModel({ username, password: md5(password), type }).save(function (
                err,
                user
            ) {
                // 生成一个 cookie(userid: user._id), 并交给浏览器保存
                res.cookie('userid', user._id, {maxAge: 1000*60*60*24})
                //直接返回User的Json数据
                const data = { username, type, _id: user._id }
                res.send({ code: 0, data })
            })
        }
    })
})
router.post('/login', function (req, res) {
    const { username, password } = req.body
    // 处理数据: 根据 username 和 password 去数据库查询得到 user
    UserModel.findOne({ username, password: md5(password) }, filter, function (
        err,
        user
    ) {
        if (user) {
            //登陆成功
            // 生成一个 cookie(userid: user._id), 并交给浏览器保存
            res.cookie('userid', user._id, {maxAge: 1000*60*60*24})
            console.log(req.cookies)
            res.send({ code: 0, data: user })
        } else {
            //登陆失败
            res.sendStatus({ code: 1, msg: '用户名或密码不正确' })
        }
    })
})
router.post('/update', function (req, res) {
    // 根据ID更新数据，之前登录成功已经保存了id在cookie
    let userid = req.cookies.userid
    //如果没有获取到用户
    if (typeof userid === 'undefined') {
        return res.send({ code: 1, msg: '请先登录' })
    }
    //存在用户，根据用户id更新对应信息

    const userEntity = req.body
    UserModel.findByIdAndUpdate({ _id: userid }, userEntity, function (
        err,
        oldUser
    ) {
        // 如果cookie有值，但查不到用户数据，则说明数据被篡改或失效了
        if (!oldUser) {
            // 通知浏览器删除此cookie数据
            res.clearCookie('userid')
            res.send({ code: 1, msg: '请先登录' })
        } else {
            // 返回数据不能带密码，用此方法消除
            const { _id, username, type } = oldUser
            const data = Object.assign({ _id, username, type }, userEntity)
            res.send({ code: 0, data })
        }
    })
})
// 根据cookie中的userid获取用户信息
router.get('/user',function (req,res) {
    // 根据ID更新数据，之前登录成功已经保存了id在cookie
    let userid = req.cookies.userid
    //如果没有获取到用户
    if (typeof userid === 'undefined') {
        return res.send({ code: 1, msg: '请先登录' })
    }
    UserModel.findOne({_id:userid},filter,function (err,user) {
        // 如果cookie有值，但查不到用户数据，则说明数据被篡改或失效了
        if (!user) {
            // 通知浏览器删除此cookie数据
            res.clearCookie('userid')
            req.send({ code: 1, msg: '请先登录' })
        } else {
            res.send({code:0,data:user})
        }
    })

})
// 根据传过来的type获取用户对应的列表
router.get('/userlist', function (req, res) {
    const data = req.query
    const type = data[0]
    UserModel.find({ type }, filter, function (err, users) {
        res.send({ code: 0, data: users })
    })
})

/*
获取当前用户所有相关聊天信息列表
 */
router.get('/msglist', function (req, res) {
    // 获取cookie中的userid
    const userid = req.cookies.userid
    // 查询得到所有user文档数组
    UserModel.find(function (err, userDocs) {
        // 用对象存储所有user信息: key为user的_id, val为name和header组成的user对象
        /*const users = {} // 对象容器
        userDocs.forEach(doc => {
          users[doc._id] = {username: doc.username, header: doc.header}
        })*/
        // 最终结果 '用户ID':{username,header}
        const users = userDocs.reduce((users, user) => {
            users[user._id] = {username: user.username, header: user.header}
            return users
        } , {})
        /*
        查询userid相关的所有聊天信息
         参数1: 查询条件
         参数2: 过滤条件
         参数3: 回调函数
        */
        // 两个查询条件 $or 或
        ChatModel.find({'$or': [{from: userid}, {to: userid}]}, filter, function (err, chatMsgs) {
            // 返回包含所有用户和当前用户相关的所有聊天消息的数据
            res.send({code: 0, data: {users, chatMsgs}})
        })
    })
})

/*
修改指定消息为已读
 */
router.post('/readmsg', function (req, res) {
    // 得到请求中的from和to
    const {from} = req.body
    const to = req.cookies.userid

    /*
    更新数据库中的chat数据
    参数1: 查询条件
    参数2: 更新为指定的数据对象
    参数3: 是否1次更新多条, 默认只更新一条
    参数4: 更新完成的回调函数
     */
    // 更新条件 {from, to, read: false}
    // 对方id 我的id 和消息read要为false未读
    // {multi: true} 将所有查询的数据都更新
    ChatModel.updateMany({from, to, read: false}, {read: true}, {multi: true}, function (err, doc) {
        res.send({code: 0, data: doc.nModified}) // 更新的数量
    })
})

module.exports = router
