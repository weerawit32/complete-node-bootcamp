const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify");

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  console.log(req.url);
  const pathName = req.url;

  if (pathName === "/" || pathName === "/overview") {
    res.end("This is the overview");
  } else if (pathName === "/product") {
    res.end("this is the product");
  } else if (pathName === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  } else {
    res.writeHead(404);
    res.end("Hello fron the server!");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to port 8000");
});
