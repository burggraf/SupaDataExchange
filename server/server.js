var fs = require('fs');
var http = require('http');
const { exec } = require("child_process");

http.createServer(function (req, res) {
  const { method, url } = req;
  if (method === "POST" && url === "/run") {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      data = JSON.parse(data);
      run_exchange(data).then((result) => {
        res.writeHead(200, {'Content-Type': 'application/json'});
        // res.statusCode = 200
        res.end(JSON.stringify({result:result}));  
        return; 
      }).catch((err) => {
        res.writeHead(200);
        res.statusCode = 200
        res.end(JSON.stringify({error: err})); 
        return; 
      });
    });
    return; 
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
  console.log('listening on port 8080');
}).listen(8080);

function run_exchange(data) {
  const { source, destination } = data;
  if (source.u && source.p && source.address.substr(0, 11) === 'postgres://') {
    source.address = source.address.replace('postgres://', `postgres://${source.u}:${source.p}@`);
  }
  if (destination.u && destination.p && destination.address.substr(0, 11) === 'postgres://') {
    destination.address = destination.address.replace('postgres://', `postgres://${destination.u}:${destination.p}@`);
  }

  console.log(`pgloader --type ${source.type} ${source.address} ${destination.address}`);
  return new Promise((resolve, reject) => {
    exec(`pgloader --type ${source.type} ${source.address} ${destination.address}`, (error, stdout, stderr) => {
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