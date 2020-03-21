var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if (!port) {
    console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
    process.exit(1)
}

var server = http.createServer(function (request, response) {
    var parsedUrl = url.parse(request.url, true)
    var pathWithQuery = request.url
    var queryString = ''
    if (pathWithQuery.indexOf('?') >= 0) {
        queryString = pathWithQuery.substring(pathWithQuery.indexOf('?'))
    }
    var path = parsedUrl.pathname //path 里没有查询参数，
    var query = parsedUrl.query
    var method = request.method

    /******** 从这里开始看，上面不要看 ************/

    console.log('有个傻子发请求过来啦！路径（带查询参数）为：' + pathWithQuery)

    const fileTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.gif': 'image/gif',
        '.png': 'image/png',
        '.jpg': 'image/jpg'
    }
    response.statusCode = 200
    //默认首页
    const filePath = path === '/' ? '/index.html' : path
    //识别后缀
    // let suffix = filePath.match(/\.[a-z]*/i)
    // suffix = suffix ? suffix[0] : '.html'
    const suffix = filePath.substring(filePath.indexOf('.'))
    response.setHeader('Content-Type', `${fileTypes[suffix] || 'text/html'};charset=utf-8`)
    // response.setHeader('Cache-control','no-cache')

    let content
    try {
        content = fs.readFileSync(`./public${filePath}`)
    } catch (error) {
        response.statusCode = 404
        content = '该文件不存在'
    }

    response.write(content)
    response.end()

    /******** 代码结束，下面不要看 ************/
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)