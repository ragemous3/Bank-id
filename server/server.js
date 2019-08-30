
  const hostname = 'localhost';
  var port = process.env.PORT || 3000;
  var http = require('http');
  var https = require('https');
  var {auth, collect, sign} = require('./bankid/bank-call.js')
  var fs = require('fs');
  var path = require('path');
  const Url = require('url');
  var querystring = require('querystring');
  //Måste jag verkligen ladda in querystring???
  var pathing = process.argv[2];
  var counter = 0;
  var httpsOptionz = {
    key: fs.readFileSync('./security/cert.key'),
    cert: fs.readFileSync('./security/cert.pem')
  }
  const mimeType = {
  '.ico': 'image/x-icon',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.eot': 'appliaction/vnd.ms-fontobject',
  '.ttf': 'aplication/font-sfnt'
};
  const server = http.createServer(async function(req,res) {
      if(req.url === '/favicon.ico') {
          res.writeHead(404, {'Content-Type': 'image/x-icon'} );
          res.end();
          return;
      }
          if(req.method === 'POST'){

              //let url = 'https://appapi2.test.bankid.com/rp/v5';
              if(req.url === '/auth' || pathing){
                  var order = await auth().then((addr) => {
                    return addr;
                  }).catch((e) => {
                    console.log(`OPS SOMETHING WENT WRONG ${e}`)
                  });

                  res.writeHead(200, {'Content-Type': 'application/json'} );
                  res.end(JSON.stringify(`bankid:///?autostarttoken=${order.autoStartToken}&redirect=null`));

                  var moredata = await collect(order.orderRef);
              }
              if(req.url === '/sign' || pathing){
                  var order = await sign().then((addr) => {
                    return addr;
                  }).catch((e) => {
                    console.log(`OPS SOMETHING WENT WRONG ${e}`)
                  });
                  res.writeHead(200, {'Content-Type': 'application/json'} );
                  res.end(JSON.stringify(`bankid:///?autostarttoken=${order.autoStartToken}&redirect=null`));

                  var moredata = await collect(order.orderRef);
              }
          }
          if(req.method === 'GET' && req.url !== undefined){
              //gör ett URL-object av urlen
              var realUrl = '';
              const parsedUrl = Url.parse(req.url);
                  const sanitizedPath = path.normalize(parsedUrl.pathname).replace(/^(\.\.[\/\\])+/, '');
                  console.log(`sanitizedPath === ${sanitizedPath}`);
                  var dir = path.resolve(__dirname + '\\..');

                      if(parsedUrl.pathname == '/'){
                        dir += '\\public'
                      }else{
                        dir += `\\src`
                        //${sanitizedPath}
                      }
                      var final = path.join(dir, sanitizedPath);

                  //fs.stat ger tillgång till att kolla om finalPath är
                  //en giltig path. Den ger tillgång till "stat-objektet" som
                  //har tillgång till metoder för att kolla typer på filer

                  fs.stat(final.toString(), (err, stats) => {
                    console.log(`1. ${final}`);

                      if(stats.isDirectory()){
                        final += 'index.html';
                        console.log('2'+final);
                        readF(final);
                      }
                      if(stats.isFile()){
                            // vfinal = path.join(dir, sanitizedPath);
                            readF(final);
                        }
                  })

                  function readF(finalPath){
                      fs.readFile(finalPath.toString(), function(err, file){
                          if(err){
                            res.statusCode = 404;
                            res.end(`File was not found!`);
                            return;
                          }else{
                            let ext = path.parse(finalPath).ext;
                            //plockar ut delar av en path och lägger ut dem i olika egenskaper
                            //Bracket-notations är skitbra om man vill finna
                            //en egenskap i ett objekt fort!
                            res.writeHead(200, {
                                  "author" 	: "Rasmus.Moberg",
                                  'Content-Type': mimeType[ext] || 'text/plain',
                                  'Access-Control-Allow-Origin': '*',
                                  'X-Powered-By':'nodejs'
                                });
                            res.end(file);
                         }
                     })
                  }
      // }
  }
  }).listen(port, () => {
    console.log(`server running at http://${hostname}:${port}`);
  })
