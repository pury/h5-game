
/**
 * 策划导表工具
 * excel表转换json数据
 * @author pury
 * @date 2020-10-18
 * 
 * Copyright (c) 2020-present, pkoala.com
 * All rights reserved.
 */

const fs = require('fs');
const path = require("path");
const xlsx = require("node-xlsx");

/**
 * excel文件数量
 */
var count = 0;

/**
 * 导出的json文件
 */
var source = "./json/config.json";
var source_min = "./json/config.min.json";

/**
 * 单个文件数据
 */
var data_path = "./data";

/**
 * excel文件路径
 */
var table_path = './tables';

/**
 * excel内容汇总
 */
var content = {};

/**
 * 生成文件
 */
function buildFile (file_name, file_data)
{
	fs.writeFileSync(data_path + "/" + file_name + ".json", JSON.stringify(file_data), 'utf8');
	fs.writeFileSync(data_path + "/" + file_name + ".min.json", JSON.stringify(file_data, null, 2), 'utf8');
}

/**
 * 处理多个页签
 */
function doTaskMore (file_name, list) 
{
	file_name = file_name.split('.')[0];
	content[file_name] = {};
	var file_data = {};

	for (var k = 0; k < list.length; k++)
	{
		var data = list[k].data;
		var len = data[0].length;
		content[file_name][list[k].name] = [];
		file_data[list[k].name] = [];

		for (var i = 2; i < data.length; i++)
		{
			if (data[i].length < len) continue;
			var cell = {};

			for (var j = 0; j < len; j++)
			{
				var cellData = data[i][j];
				cell[data[1][j]] = cellData;
			}

			content[file_name][list[k].name].push(cell);
			file_data[list[k].name].push(cell);
			buildFile(file_name, file_data);
		}
	}
}

/**
 * 解析excel表
 */
function parseFile (file_name, file_path) 
{
	var list = xlsx.parse(file_path);
	doTaskMore(file_name, list);
}

/**
 * 遍历excel文件目录
 */
function readDirSync (path)
{
	var pa = fs.readdirSync(path);
	pa.forEach(function(ele,index) {
		var info = fs.statSync(path+"/"+ele)

		if(info.isDirectory())
		{
			readDirSync(path+"/"+ele);
		}
		else
		{
			/** 自定义筛选条件 */
			if (ele.indexOf('.xlsx') < 0) return;
			if (ele.indexOf('~$') >= 0) return;
			if (ele.indexOf('*.swp') >= 0) return;
			count++;
			parseFile(ele, path + "/" + ele);
			console.log("file:" + path + "/" + ele);
		}
	})
}

readDirSync(table_path);
fs.writeFileSync(source, JSON.stringify(content, null, 2), 'utf8');
fs.writeFileSync(source_min, JSON.stringify(content), 'utf8');
console.log("Total count: " + count, "\nSuccess!");
