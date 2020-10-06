
var clicked = false;
function clickLogin(){
clicked = true;
}
function onSignIn(googleUser) {
  if(clicked){
    /// instead of getting a userprofile in client side we get the id_token instead and will send it to our server
    var id_token = googleUser.getAuthResponse().id_token;
    // send the ID token to our server with an HTTPS POST request:
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3000/action/tokensignin');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange =function(){
      if(xhr.readyState == 4 && xhr.status == 200){
        let baseUrl = "http://localhost:3000/google-signup"
      window.location.replace(baseUrl);
      console.log(xhr.responseText);
      }
   
    };
    xhr.send('idtoken=' + id_token);
  }
}

