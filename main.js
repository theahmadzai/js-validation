"use strict";

var Errors =
  /*#__PURE__*/
  (function() {
    function Errors() {
      this.errors = {};
    }

    var _proto = Errors.prototype;

    _proto.has = function has(field) {
      return this.errors.hasOwnProperty(field);
    };

    _proto.any = function any() {
      return Object.keys(this.errors).length > 0;
    };

    _proto.get = function get(field) {
      if (this.errors[field]) {
        return this.errors[field][0];
      }
    };

    _proto.record = function record(errors) {
      this.errors = errors;
    };

    _proto.clear = function clear(field) {
      if (field) {
        delete this.errors[field];
        return;
      }

      this.errors = {};
    };

    return Errors;
  })();

var Form =
  /*#__PURE__*/
  (function() {
    function Form(source, data) {
      if (data === void 0) {
        data = {};
      }

      this.source = source;

      if (data !== Object(data)) {
        return;
      }

      this.data = data;

      for (var field in data) {
        this[field] = data[field];
      }

      this.errors = new Errors();
    }

    var _proto2 = Form.prototype;

    _proto2.data = function data() {
      var data = {};

      for (var field in this.data) {
        data[field] = this[field];
      }

      return data;
    };

    _proto2.reset = function reset() {
      for (var field in this.data) {
        this[field] = null;
      }
    };

    _proto2.submit = function submit(method, url) {
      var _this = this;

      return new Promise(function(resolve, reject) {
        _this.source[method](url, _this.data())
          .then(function(response) {
            _this.reset();

            _this.errors.clear();

            resolve(response.data);
          })
          .catch(function(error) {
            _this.errors.record(error.response.data);

            reject(error.response.data);
          });
      });
    };

    return Form;
  })();

module.exports = Form;
