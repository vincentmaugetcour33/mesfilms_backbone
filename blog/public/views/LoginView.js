var Blog = (function(blog) {

  blog.Views.LoginView = Backbone.View.extend({
    el: $("#blog_login_form"),

    initialize: function(args) {
      var that = this;
      this.adminView = args.adminView;
      this.template = _.template($("#blog_login_form_template").html());

      //on vérifie si pas déjà authentifié
      $.ajax({
        type: "GET",
        url: "/alreadyauthenticated",
        error: function(err) {
          console.log(err);
        },
        success: function(dataFromServer) {

          if (dataFromServer.firstName) {
            that.render("Bienvenue", dataFromServer);
          } else {
            that.render("Bienvenue", {
              firstName: "INTERNAUTE",
              lastName: ""
            });
          }
        }
      });

    },

    render: function(message, user) {

      var renderedContent = this.template({ message: message, 
          firstname: user ? user.firstName : "", 
          lastname: user ? user.lastName : ""
          });
      var adminLinkLabel = user ? user.isAdmin ? "Administration" : "" : "";
      this.$el.html(renderedContent+"<br><a id='adminbtn' href='#'>"+adminLinkLabel+"</a>");
    },

    events: {
      "click  .btn-primary": "onClickBtnLogin",
      "click  .btn-default": "onClickBtnLogoff",
      "click #adminbtn": "displayAdminPanel"
    },

    displayAdminPanel: function() {
      this.adminView.render();
    },

    onClickBtnLogin: function(domEvent) {

      var fields = $("#blog_login_form :input"),
        that = this;

      $.ajax({
        type: "POST",
        url: "/authenticate",
        data: {
          email: fields[0].value,
          password: fields[1].value
        },
        dataType: 'json',
        error: function(err) {
          console.log(err);
        },
        success: function(dataFromServer) {

          if (dataFromServer.infos) {
            that.render(dataFromServer.infos);
          } else {
            if (dataFromServer.error) {
              that.render(dataFromServer.error);
            } else {
              that.render("Bienvenue", dataFromServer);
            }
          }

        }
      });
    },
    onClickBtnLogoff: function() {

      var that = this;
      $.ajax({
        type: "GET",
        url: "/logoff",
        error: function(err) {
          console.log(err);
        },
        success: function(dataFromServer) {
          console.log(dataFromServer);
          that.render("Bienvenue", {
            firstName: "INTERNAUTE",
            lastName: ""
          });
        }
      })
    }

  });

  return blog;
}(Blog));