'user strict';

const fs = require('fs');
const path = require('path');

exports.cache = {};
exports.root = __dirname;
exports.views = '../views';
exports.ext = 'html';

let readFile = function(fileName, options, skip = true)
{
  if(!fileName.endsWith(exports.ext)) fileName += '.' + exports.ext;
  if(exports.cache[fileName]) return exports.compile(exports.cache[fileName], options);
  let str = fs.readFileSync(fileName, 'utf8');
  str = include(str);//join
  let templ = exports.compile(str, options, skip);
  //#cover to design ui
//  exports.cache[fileName] = str;
  return templ;
}

let include = function(str)
{
  let partial = str.split(/<include filename=([A-Za-z0-9\/\\\.]*)(\soptions=\'([^\']*)\')?>/g);
  for(let i = 1; i < partial.length; i += 4)
  {
    if(typeof partial[i + 2] === "undefined")
      partial[i] = readFile(`${exports.root}/${exports.views}/${partial[i]}`, {}, false);
    else
      partial[i] = readFile(`${exports.root}/${exports.views}/${partial[i]}`, JSON.parse(partial[i + 2]), false);

    partial[i + 1] = '';
    partial[i + 2] = '';
  }

  return partial.join('');
}

let sector = function(str, options) {
  let args = str.split(/<sector name=([a-zA-Z0-9_]*)>/);
  let rstr = args[0];
  let pos;

  for(let i = 1; i < args.length; i += 2)
  {
    pos = args[i + 1].indexOf('</sector>');
    if(pos === -1) throw new Error('engine not compiler');
    if(options.hasOwnProperty(args[i]) && options[args[i]])
      rstr += args[i + 1].substring(0, pos);

    rstr += args[i + 1].substring(pos + 9);
  }

  return rstr;
}

exports.compile = function(str, options, skip)
{
  if(!options.hasOwnProperty('__sector__')) options.__sector__ = {};
  str = sector(str, options.__sector__);

  if(options instanceof Array)
  {
    for(let idx of options)
    {
      let key = options[idx];
      let reg = new RegExp('<eng data=' + key + '>','g');
      str = str.replace(reg, key);
    }
  }
  else if(options instanceof Object)
  {
    for(let key in options)
    {
      if(!options.hasOwnProperty(key) || typeof options[key] === 'object' || /__([a-zA-Z0-9]*)__/.test(key)) continue;

      let reg = new RegExp('<eng data=' + String(key) + '>','g');
      str = str.replace(reg, options[key]);
    }
  }

  let mats = str.match(/<engif ([a-zA-Z0-9_])*(==|>|<|>=|<=|!=)([^>])*>/g);
  if(mats === null) mats = [];
  for(let i of mats)
  {
    let pos = str.indexOf(i);
    if(pos === -1) throw new Error('engine not compiler');
    let pre = str.substring(0, pos);
    let aft = str.substring(pos + i.length);
    let fpos = aft.indexOf('</engif>');
    if(fpos === -1) throw new Error('engine not compiler');
    let ctx = aft.substring(0, fpos);
    aft = aft.substring(fpos + 8);
    let parse = i.split(/<engif ([a-zA-Z0-9_]*)(==|>|<|>=|<=|!=)([^>]*)>/);
    if(options.hasOwnProperty(parse[1]))
    {
      let jsctx = `
                    let ${parse[1]} = ${options[parse[1]]};
                    ${parse[1]}${parse[2]}${parse[3]};
                  `
      if(eval(jsctx))
        str = pre + ctx + aft;
      else
        str = pre + aft;
    }
  }

  if(skip) return str.replace(/<eng data=([_a-zA-Z0-9]*)>/g, '');
  return str;
}

exports.renderFile = function(fileName, options, callback)
{
  let templ = readFile(fileName, options);
  return callback(null, templ);
}

exports.__engine__ = function(filePath, options, callback)
{
  return exports.renderFile(filePath, options, callback);
}
