const config = require('./config.json');

if(typeof String.prototype.addslashes === 'undefined')
{
  String.prototype.addslashes = function() {
    return this.replace(/[\\"']/g, '\\$&')
    .replace(/\u0000/g, '\\0');
  }
}

module.exports = {
  inherit: function(a, b) {
    for(let i in a)
      if(a.hasOwnProperty(i)) b[i] = a[i];
  },
  override:  function(a, b) {
    for(let i in a)
      if(a.hasOwnProperty(i) && !b.hasOwnProperty(i)) b[i] = a[i];
  },
  deepclone: function(a, b, c) {
    if(!(c instanceof Array)) c = [];
    for(let i in a)
      if(a.hasOwnProperty(i) && c.indexOf(i.toString()) === -1)
      {
        if(a[i] instanceof Array) b[i] = a[i];
        else if(typeof a[i] === 'object')
        {
          if(!b.hasOwnProperty(i)) b[i] = {};
          this.deepclone(a[i], b[i]);
        }
        else b[i] = a[i];
      }
  },
  clonewith: function(a, b, c) {
    if(!(c instanceof Array)) c = [];
    for(let i in a)
      if(a.hasOwnProperty(i) && c.indexOf(i.toString()) !== -1) b[i] = a[i];
  },
  clonewithout: function(a, b, c) {
    if(!(c instanceof Array)) c = [];
    for(let i in a)
      if(a.hasOwnProperty(i) && c.indexOf(i.toString()) === -1) b[i] = a[i];
  },
  htmlentities: function(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  },
  hasattr: function(obj, attr) {
    if(typeof obj['hasOwnProperty'] === 'undefined') throw '##obj has not attribute hasOwnProperty.';
    if(typeof attr === 'string') return obj.hasOwnProperty(attr);
    if(attr instanceof Array)
    {
      let un = true;
      for(let i of attr)
        if(!(un = obj.hasOwnProperty(i))) break;

      return un;
    }

    throw 'variable ##attr invalid';
  },
  _typeof: function(variable) {
    if(variable instanceof Array) return 'array';
    if(variable instanceof Promise) return 'promise';
    return (typeof variable).toString();
  },
  hastype: function(obj, types) {
    let un = true;
    for(let i in types)
      if(!(un = (obj.hasOwnProperty(i) && (this._typeof(obj[i]) === types[i])))) break;

    return un;
  },
  c_number: function(obj, types) {
    if(!(types instanceof Array)) throw '##types invalid';
    let pattern = /^([0-9])*$/;
    for(let i in obj)
      if(obj.hasOwnProperty(i) && types.indexOf(i.toString()) !== -1 && pattern.test(String(obj[i]).trim()))
        obj[i] = parseInt(String(obj[i]).trim());
  },
  entext: function(obj) {
    for(let i in obj)
      if(obj.hasOwnProperty(i) && typeof obj[i]=== 'string') obj[i] = this.htmlentities(String(obj[i]).trim()).addslashes();
  },
  getParameterByName: function(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  },
  getHost: function(url) {
    return url.match(/(http(s)?:\/\/)?([a-zA-Z0-9_\-\.])*/)[0];
  }
};
