
import {builder} from '/js/build.js';


var request = {

    bankID: async function(url){
        await fetch(url,{
        method: 'POST',
        host: 'localhost',
        cache: 'no-cache',
      }).then((prom) => {
          var data = prom.json();
          return data;
      }).then((response) => {
          console.log(`Response ok? ${response}`);
          console.log(response);
          builder.bankButton(response);
          // request.collection(response.orderRef);
      }).catch((e) => {
          console.log(`Something went wrong! ${e}`);
      });
      }
}
export {request}
