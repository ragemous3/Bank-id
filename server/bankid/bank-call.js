
var {BankID} = require('./bankid-solution');

async function auth(){
   var data = await BankID.authenticate().then((x) => {
      var data = JSON.parse(x);
      console.log(`Parsed response from authentication ${x.autoStartToken}`);
      return data;
  }).then((data) => {
    return data;
  }).catch((e) => {
    console.log(`WHAAAAT ${e}`);
  });
  console.log(data);
  return data;
}
async function collect(order){
    var collect = await BankID.collect(order).then((data) => {
      console.log(data);
      return JSON.stringify(collect);
   }).catch((e) => {
     console.log(`Problem caught in collect-method ${e}`);
   });
   console.log(`Collect-Promise completed. Results: ${collect}`);
   return collect;
}
async function sign(){
   var data = await BankID.sign().then((x) => {
      var data = JSON.parse(x);
      console.log(`Parsed response from signing ${x.autoStartToken}`);
      return data;
  }).then((data) => {
    return data;
  }).catch((e) => {
    console.log(`WHAAAAT ${e}`);
  });
  console.log(data);
  return data;
}
module.exports = {auth, collect, sign}
