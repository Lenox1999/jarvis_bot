module.exports = (args) => {
  return args.split("=")[1].split("").slice(0, 10).join("");
};
