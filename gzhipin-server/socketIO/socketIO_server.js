const { ChatModel } =require('../db/models')
module.exports = function (server) {
    const io = require('socket.io')(server)

    //服务器监视server发送过来的链接
    io.on('connection',function (socket) {
        //console.log('有一个客户端连接上了服务器')
        // 绑定监听，接收客户端发送的消息
        socket.on('sendMsg',function ({ from, to, content }) {
            console.log({ from, to, content })
            // 处理数据（保存消息）
            // 准备charMsg对象的相关数据
            // sort()排序，join中间加下划线 根据这个得知我和谁聊天
            const chat_id = [from, to].sort().join('_') //from_to或者to_from
            const create_time = Date.now()
            new ChatModel({ from, to, content ,chat_id,create_time}).save(function (err, charMsg) {
                //向客户端发消息
                io.emit('serverMsg', charMsg)
            })
        })
    })
}
