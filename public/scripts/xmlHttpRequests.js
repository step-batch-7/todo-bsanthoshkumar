const sendHttpGet = (url, callback) => {
  const request = new XMLHttpRequest();
  request.open('GET', url);
  request.onload = function () {
    if (this.status === 200) {
      callback(this.responseText);
    }
  };
  request.send();
};

const sendHttpPost = (url, data, callback) => {
  const request = new XMLHttpRequest();
  request.open('POST', url);
  request.onload = function () {
    if (this.status === 200) {
      callback(this.responseText);
    }
  };
  request.send(data);
};