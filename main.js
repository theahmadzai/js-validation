(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Form = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
class Errors {
  constructor() {
    this.errors = {};
  }

  has(field) {
    return this.errors.hasOwnProperty(field);
  }

  any() {
    return Object.keys(this.errors).length > 0;
  }

  get(field) {
    if(this.errors[field]) {
      return this.errors[field][0];
    }
  }

  record(errors) {
    this.errors = errors;
  }

  clear(field) {
    if(field) {
      delete this.errors[field];
      return;
    }

    this.errors = {};
  }
};

module.exports = Errors;

},{}],2:[function(require,module,exports){
const Errors = require('./errors.js');

class Form {
  constructor(source, data = {}) {
    this.source = source;

    if(data !== Object(data)) {
      return;
    }

    this.data = data;

    for(let field in data) {
      this[field] = data[field];
    }

    this.errors = new Errors();
  }


  data() {
    let data = {};

    for(let field in this.data) {
      data[field] = this[field];
    }

    return data;
  }


  reset() {
    for(let field in this.data) {
      this[field] = null;
    }
  }


  submit(method, url) {
    return new Promise((resolve, reject) => {
      this.source[method](url, this.data())
        .then(response => {
          this.reset();
          this.errors.clear();
          resolve(response.data);
        })
        .catch(error => {
          this.errors.record(error.response.data);
          reject(error.response.data);
        });
    });
  }
};

module.exports = Form;

},{"./errors.js":1}]},{},[2])(2)
});