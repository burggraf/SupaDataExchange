var fs = require('fs');
var http = require('http');
const { exec } = require("child_process");

http.createServer(function (req, res) {
  const { method, url, headers } = req;
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
    let folder = './';
    if (fs.existsSync('../www')) {
      folder = '../www/'
    }
    fs.readFile(folder + req.url, function (err,data) {
    // fs.readFile("./" + req.url, function (err,data) {
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
console.log(`listening on port 8080: ${new Date()}`);

function run_exchange(data) {
  let { source, destination, commandline } = data;
  const id = data.id || uuid();
  if (!commandline) {
    if (source.u && source.p && source.address.substr(0, 11) === 'postgres://') {
      source.address = source.address.replace('postgres://', `postgres://${source.u}:${source.p}@`);
    }
    if (destination.u && destination.p && destination.address.substr(0, 11) === 'postgres://') {
      destination.address = destination.address.replace('postgres://', `postgres://${destination.u}:${destination.p}@`);
    }
    commandline = `pgloader --type ${source.type} --root-dir /tmp/pgloader/${id} ${source.address} ${destination.address}`;  
  } else {
    commandline = `pgloader --root-dir /tmp/pgloader/${id} ${commandline}`;
  }
  console.log(commandline);
  return new Promise((resolve, reject) => {
    exec(commandline, (error, stdout, stderr) => {
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
function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    let random = Math.random() * 16 | 0; // Nachkommastellen abschneiden
    let value = char === "x" ? random : (random % 4 + 8); // Bei x Random 0-15 (0-F), bei y Random 0-3 + 8 = 8-11 (8-b) gemäss RFC 4122
    return value.toString(16);     
  });
}
