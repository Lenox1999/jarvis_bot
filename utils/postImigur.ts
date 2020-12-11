import axios, { AxiosRequestConfig } from "axios";
import { MessageEmbedImage } from "discord.js";
import FormData from "form-data";

export default (img: MessageEmbedImage) => {
  const data = new FormData();
  data.append("image", img);

  const config : AxiosRequestConfig = {
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
