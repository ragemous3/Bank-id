
import {request} from '/js/requests.js';

  var Main_Object = {

      add_listeners: function() {
          document.addEventListener('click', this.click_events);
      },
      click_events: async function(){
          var target = event.target;
          if(target.matches('#authenticate')){
              event.preventDefault();
              var url = '/auth';
              request.bankID(url)
          }
          if(target.matches('#sign')){
            event.preventDefault();
            var url = '/sign';
            request.bankID(url)
          }
          if(target.matches('#banko')){
            console.log(target.href)
            event.preventDefault();
            var timeout = window.setTimeout(function() {
                console.log('timeout');
                window.location = "http://localhost:3000/";
              }, 1000);

              window.location = target.href;
              event.preventDefault();
          }
      }
  }

  Main_Object.add_listeners();
