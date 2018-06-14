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
