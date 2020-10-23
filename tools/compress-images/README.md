

 使用tinypng批量压缩图片，无需配置key，突破数量限制等，在已有脚本基础上做了进一步优化。


### 优化

 * 支持命令行传参
 * 支持遍历多级文件夹
 * 支持配置原文件目录和输出目录，压缩后目录结构不变（如果两个目录相同，可相当于覆盖原文件）

 ### 使用

 下载到本地
 ```
    git clone https://github.com/pury/h5-game/tree/main/tools/compress-image
 ```

 配置默认参数

 ```js
    /** * 默认原目录 */
    var origin_dir = "./origin";
    /** * 默认输出目录 */
    var output_dir = "./output";
 ```

 执行

 ```
    $ node index.js [原目录(可选)] [输出目录(可选)]
 ```

 ### 感谢 
 
 * https://github.com/zhanyuzhang/super-tinypng (优化：通过 X-Forwarded-For 添加了动态随机伪IP，绕过 tinypng 的上传数量限制)
 
 * https://segmentfault.com/a/1190000015467084