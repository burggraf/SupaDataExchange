var fs = require('fs');
var http = require('http');
const { exec } = require("child_process");

http.createServer(function (req, res) {
  const { method, url, headers } = req;
  if (method === "GET" && url === "/test") {
    /*
    res.setHeader("Content-Type", "application/json")
    const responseBody = {
      headers,
      method,
      url,
      body: ["Mrs. Meowsers", "Hairball", "Jerk"]
    }

    res.write(JSON.stringify(responseBody))
    */
    test_load().then((result) => {
      res.writeHead(200);
      res.statusCode = 200
      res.end(result);  
    }).catch((err) => {
      res.writeHead(200);
      res.statusCode = 200
      res.end(JSON.stringify(err));  
    });
    // const result = 'testing';
    // res.write();
  } else {
    fs.readFile("../www/" + req.url, function (err,data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });  
  }

}).listen(8080);

function test_load() {
  return new Promise((resolve, reject) => {
    exec("pgloader /Users/markb/dev/SupaDataExchange/server/test2.http.load", (error, stdout, stderr) => {
      if (error) {
          reject(error.message);
      } else if (stderr) {
          reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  
  });
}