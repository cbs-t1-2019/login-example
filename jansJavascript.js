// We create a user class, so we have an easy way to create users and further implement features at a later stage
class User {

  // The constructor for our class, which will allow us to create new objects of our class
  constructor(firstname, lastname, username, password, lastAccess) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.username = username;
    this.password = password;
    this.lastAccess = lastAccess;
  }

  // Function that allows us to set lastAccess to current time in unix time (Date.now())
  setLastAccess(){
    this.lastAccess = Date.now();
  }

  // Simple function to hash passwords in order for us not to store then in clear text
  hashPassword(rawPassword){
    var a = 1, c = 0, h, o;
    if (rawPassword) {
      a = 0;
      /*jshint plusplus:false bitwise:false*/
      for (h = rawPassword.length - 1; h >= 0; h--) {
        o = rawPassword.charCodeAt(h);
        a = (a<<6&268435455) + o + (o<<14);
        c = a & 266338304;
        a = c!==0?a^c>>21:a;
      }
    }else {
      // If the password is not valid, we'll throw and error we're able to catch
      throw new Error("The password supplied is not valid");
    }
    return String(a);
  }
}

// We set a debug variable in order to switch on or off debug mode of our small program
var debug = 1;

var users;

if (localStorage.getItem('users') === null) {
  users = [];
} else {
  users = JSON.parse(localStorage.getItem('users'));
  for (let i = 0; i < users.length; i++) {
    users[i] = new User(users[i].firstname, users[i].lastname, users[i].username, users[i].password, users[i].lastAccess);
  }
}

// Bind the button to a variable for later use
var submit = document.getElementById('submit');
var register = document.getElementById('register');

// Bind the span for result text for later use
var resultSpan = document.getElementById('loginResult');

// Bind a counter in order to see if the user has tried to login too many times
var counter = 3;

if (register) {
  register.onclick = function () {
  // Bind the two input fields and get the value
    var inputUsername = document.getElementById('username');
    var inputPassword = document.getElementById('password');

    if(inputUsername.value.length == 0 || inputPassword.value.length == 0){
      // We set the resultspan with a new text and return false to get out of this function
      resultSpan.innerText = "You need to enter a username and password in order to use our system";
      return false;
    } 

    // TODO check if username is already registered 

    users.push(new User(inputUsername.value, null, inputUsername.value, User.prototype.hashPassword(inputPassword.value)));
    localStorage.setItem('users', JSON.stringify(users));
  }
}

if (submit) {
  // Bind the onClick-function to our own function
  submit.onclick = function(){

    // Bind the two input fields and get the value
    var inputUsername = document.getElementById('username');
    var inputPassword = document.getElementById('password');

    if(inputUsername.value.length == 0 || inputPassword.value.length == 0){
      // We set the resultspan with a new text and return false to get out of this function
      resultSpan.innerText = "You need to enter a username and password in order to use our system";
      return false;
    }

    // We loop through all our users and return true if we find a match
    for(var i = 0; i < users.length; i++) {

      // Bind user to a variable for easy use
      var user = users[i];

      // If debug mode is enabled, we console.log the user object from the list
      if(debug == 1){
        console.log(user);
      }

      // We use a try-catch for the hash-password function, since something could go wrong.
      try {

        // We try to create a variable with the hashed version of the inputPassword
        var hashedInputPassword = user.hashPassword(inputPassword.value);
      } catch(error){

        // We console log any error that might have been thrown
        console.log(error);
      }

      // If username and password we have in put matches the one in our loop
      if(user.username == inputUsername.value && user.password == hashedInputPassword) {

        // Update the lastAccess of the user-object
        user.setLastAccess();
        localStorage.setItem('users', JSON.stringify(users));

        // We set the resultspan with a new text and return true to get out of this function. The date will be in unixtime
        // TODO: We wan't something better than unixtime for the user!
        resultSpan.innerText = "Hi " + user.firstname + " " + user.lastname + ", you've successfully entered the system at: "+user.lastAccess;

        // Return true to jump out of the function, since we now have all we need.
        return true;
      }
    }

    // We check if the user has tried to enter a wrong username and password too many times
    if(counter == 0){
      // Since the user has tried three times, we let the user know that he's been banned
      resultSpan.innerText = "You've entered the wrong username and password three times. You've been banned from our system";

      // Disable the two input fields and the button in order for the user to not make any trouble
      inputUsername.disabled = true;
      inputPassword.disabled = true;
      submit.disabled = true;

      // Return false to stop us from doing anything further.
      return false;

    }else {
      // Since we did not find a match, we know that the user has typed a wrong password and username
      resultSpan.innerText = "You've entered a username or password that does not match our stored credentials";

      // Update the counter with an attempt of logging in.
      counter--;

      // Return false, since we do not have anything more to do
      return false;
    }
  };  
}
