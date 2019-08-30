

var builder = {

    bankButton: function(response){
        var aTag = document.createElement('a');
        aTag.href = response;
        aTag.textContent = 'Do you want to open BankId on your own computer?'
        aTag.id = 'banko';
        var body = document.getElementById('bodybody')
        body.appendChild(aTag);
    }

}
export {builder}
