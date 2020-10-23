/**
 * 图片压缩工具
 * @author pury
 * @date 2020-10-22
 * 
 * https://github.com/pury/h5-game/tree/main/tools/compress-image
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

/*===================================================*/
/*================配置区域 begin=======================*/

/**
 * 默认原目录
 */
var origin_dir = "./origin";
/**
 * 默认输出目录
 */
var output_dir = "./output";
/**
 * 支持处理的文件后缀
 */
const exts = ['.jpg', '.png'];
/**
 * 文件大小限制
 */
const max = 5200000; // 5MB == 5242848.754299136

/*=================配置区域 end=======================*/
/*====================================================*/


// 检测命令行参数
var arguments = process.argv.splice(2);
(arguments.length == 1) && (origin_dir = arguments[0]);
(arguments.length == 2) && (output_dir = arguments[1]);

const options = {
  method: 'POST',
  hostname: 'tinypng.com',
  path: '/web/shrink',
  headers: {
    rejectUnauthorized: false,
    'Postman-Token': Date.now(),
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
  }
};

readDirSync(origin_dir);

// 生成随机IP， 赋值给 X-Forwarded-For
function getRandomIP() {
  return Array.from(Array(4)).map(() => parseInt(Math.random() * 255)).join('.')
}

// 遍历文件目录
function readDirSync (path) {
  var pa = fs.readdirSync(path);
  pa.forEach(function(ele,index) {
    var info = fs.statSync(path+"/"+ele)

    if(info.isDirectory()) {
      readDirSync(path+"/"+ele);
    } else{
      if (ele.indexOf(".DS_Store") >= 0) return;
      // console.log("file:" + path + "/" + ele);
      fileFilter(path+"/"+ele, path);
    }
  })
}

// 根据url创建多级目录
function mkdirs (dirpath, callback) {
  fs.exists(dirpath, function(exists) {
      if(exists) {
        callback();
      } else {
        // 尝试创建父目录，然后再创建当前目录
        mkdirs(path.dirname(dirpath), function(){
          fs.mkdir(dirpath, callback);
        });
      }
  })
};

// 过滤文件格式，返回所有jpg,png图片
function fileFilter(file, filePath) {
  fs.stat(file, (err, stats) => {
    if (err) return console.error(err);
    if (
      // 必须是文件，小于5MB，后缀 jpg||png
      stats.size <= max &&
      stats.isFile() &&
      exts.includes(path.extname(file))
    ) {
      
      // 通过 X-Forwarded-For 头部伪造客户端IP
      options.headers['X-Forwarded-For'] = getRandomIP();

      fileUpload(file, filePath);  // console.log('可以压缩：' + file);
    }
    // if (stats.isDirectory()) fileList(file + '/');
  });
}

// 异步API,压缩图片
// {"error":"Bad request","message":"Request is invalid"}
// {"input": { "size": 887, "type": "image/png" },"output": { "size": 785, "type": "image/png", "width": 81, "height": 81, "ratio": 0.885, "url": "https://tinypng.com/web/output/7aztz90nq5p9545zch8gjzqg5ubdatd6" }}
function fileUpload(img, filePath) {
  var req = https.request(options, function(res) {
    res.on('data', buf => {
      let obj = JSON.parse(buf.toString());
      if (obj.error) {
        console.log(`[${img}]：压缩失败！报错：${obj.message}`);
      } else {
        fileUpdate(img, obj, filePath);
      }
    });
  });

  req.write(fs.readFileSync(img), 'binary');
  req.on('error', e => {
    console.error(e);
  });
  req.end();
}
// 该方法被循环调用,请求图片数据
function fileUpdate(imgpath, obj, filePath) {
  imgpath = path.join(output_dir, imgpath.replace(origin_dir, ''));
  mkdirs(filePath.replace(origin_dir, output_dir), function () {
    let options = new URL(obj.output.url);
    let req = https.request(options, res => {
      let body = '';
      res.setEncoding('binary');
      res.on('data', function(data) {
        body += data;
      });

      res.on('end', function() {
        fs.writeFile(imgpath, body, 'binary', err => {
          if (err) return console.error(err);
          console.log(
            `[${imgpath}] \n 压缩成功，原始大小-${obj.input.size}，压缩大小-${
              obj.output.size
            }，优化比例-${obj.output.ratio}`
          );
        });
      });
    });
    req.on('error', e => {
      console.error(e);
    });
    req.end();  
  });
}
