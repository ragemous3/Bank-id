var https = require('https');
var fs = require('fs');
var BankID = {

    options: {
        host: 'appapi2.test.bankid.com',
        path: '',
        method: 'POST',
        agent: new https.Agent({
            passphrase: "qwerty123",
            pfx: fs.readFileSync("cert/FPTestcert2_20150818_102329.pfx"),
            ca: fs.readFileSync("cert/test.ca")
        }),
        headers: {}
    },
            //"certificatePolicies":["1.2.752.78.1.1"]
    authenticate: async function() {

        var payload = {
            "endUserIp": "127.0.0.1",
            "personalNumber":"199208290032",
            "requirement": {"autoStartTokenRequired":true},
           // "userVisibleData": "IFRoaXMgaXMgYSBzYW1wbGUgdGV4dCB0byBiZSBzaWduZWQ="
        };

        var payloadBuffer = Buffer.from(JSON.stringify(payload));

        this.options.path = '/rp/v5/auth';

        this.options.headers = {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payloadBuffer)
        }

            return new Promise((resolve, reject) => {
                var x = this.call(payload);
                resolve(x);
            }).catch((e) => {
                console.error(`there was an errror!!: ${e}`)
            });

  },
  sign: async function(){
    // var text = "Jag intygar att jag är mig själv";
    // text = text.toString("utf-8")
      var payload = {
        "userVisibleData": Buffer.from("Signera skiten!", "utf-8").toString("base64"),
        "endUserIp": "127.0.0.1",
        "personalNumber":"199208290032"
      }
      this.options.path = '/rp/v5/sign'
      var payloadBuffer = Buffer.from(JSON.stringify(payload))
      this.options.headers = {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payloadBuffer)
      }
      return new Promise((resolve, reject) => {
          var x = this.call(payload);
          resolve(x);
      }).catch((e) => {
          console.error(`there was an errror!!: ${e}`)
      });
  },
  call: async function(payload){
      var str = '';
      return new Promise((resolve,reject) => {
        var request = https.request(this.options, (resp) => {
                resp.on('data', chunk => str += chunk);
                resp.on('end', () => {
                  resolve(str);
                })
            }).on('error', (err) => {
                  console.log(`there was an error ${err.message}, ${err.error}`);
                  reject(err);
            }).on('connect', status => {
                  console.log('Connection was successful ' + status);
            }).on('socket', requestData => {
                  console.log('Authentication/Sign-socket opened');
            })
      request.write(JSON.stringify(payload))
      request.end();
      })
  },
  collect: async function(param){
      var payload = {
        orderRef: param
      }
      console.log(`payload inside collect: ${JSON.stringify(payload)}`);
      this.options.path = '/rp/v5/collect';
      var payloadBuffer = Buffer.from(JSON.stringify(payload));
      this.options.headers = {
        'Content-Type':'application/json',
        'Content-Length': Buffer.byteLength(payloadBuffer)
      }
      var options = this.options;
          return new Promise((resolve,reject) => {

              var timer = setInterval(function(){
                var str = '';
                var request = https.request(options, function(resp){
                    resp.on('data', chunk => str += chunk)
                    resp.on('end', () => {
                        var call = JSON.parse(str);
                            if(call.status === 'pending'){
                                console.log(call.hintCode);
                                console.log(call);
                            }
                            if(call.errorCode){
                                console.log(call.details);
                                console.log(call.errorCode);
                                clearInterval(timer);
                                reject(call.errorCode)
                            }
                            if(call.status === 'failed'){
                                console.log(call.hintCode);
                                clearInterval(timer);
                                reject(call);
                            }
                            if(call.status === 'complete'){
                                clearInterval(timer);
                                resolve(call.completionData.user);
                            }
                    })
                }).on('error', (err) => {
                      console.log(`An error was found: ${err}`);
                      reject();
                }).on('socket', (info) => {
                      console.log(`Information was passed via a new socket using
                      the collect-method`);
                }).on('close', (data) => {
                      console.log('close event triggered');
                });

                request.write(JSON.stringify(payload));
                request.end();
              }, 3000);

          }).catch((e) => {
                console.log(`Problem caught in promise. Error: ${e}`)
          })

  }
}
  module.exports = {BankID}
