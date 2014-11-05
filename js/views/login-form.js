var View = require("handlebones").View;
var template = require("../tmpl/login-form");
var PolisStorage = require("../util/polisStorage");
var serialize = require("../util/serialize");

module.exports = View.extend({
  name: "login-form",
  template: template,
  events: {
    "submit form": function(event){
      var that = this;
      event.preventDefault();
      var urlPrefix = "https://pol.is/";
      if (-1 === document.domain.indexOf("pol.is")) {
          urlPrefix = "http://localhost:5000/"; // TODO centralize the network config
      }
      serialize(this, function(attrs){
        $.ajax({
          url: urlPrefix + "api/v3/auth/login",
          type: "POST",
          dataType: "json",
          xhrFields: {
            withCredentials: true
          },
          // crossDomain: true,
          data: attrs
        }).then(function(data) {
          that.trigger("authenticated");
        }, function(err) {
            alert("Oops! Login was unsuccessful. Please check to make sure you are online, and that your username and password are correct.");
        });
      });
    },
    "invalid": function(errors){
      console.log("invalid form input" + errors[0].name);
      console.error(errors);
     //_.each(errors, function(err){
        $("input[name=\""+errors[0].name+"\"]").closest("label").append(errors[0].message); // relationship between each input and error name
        //'input[name="firstName"]'
      //})
    }
  },
  validateInput: function(attrs){
    var errors = [];
    if(attrs.email === ""){
      errors.push({name: "description",  message: "hey there... you need an email"});
    }
    return errors;
  },
  initialize: function(options) {
  }
});