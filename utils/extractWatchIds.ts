export default (link: string) => {
  return link.split("=")[1].split("").slice(0, 11).join("");
};
