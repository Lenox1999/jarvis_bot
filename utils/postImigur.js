const axios = require("axios");
const FormData = require("form-data");

exports.uploadImage = (img) => {
  const data = new FormData();
  data.append("image", img);

  const config = {
    method: "post",
    url: "https://api.imgur.com/3/image",
    headers: {
      Authorization: "e75c11b5caec848",
      ...data.getHeaders(),
    },
    data: data,
  };

  axios(config).then((res) => {
    return JSON.stringify(res);
  });
};
