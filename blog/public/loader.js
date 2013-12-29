yepnope({
  load: {
    jquery: 'libs/vendors/jquery.js',
    underscore: 'libs/vendors/underscore.js',
    backbone: 'libs/vendors/backbone.js',
   

    //NameSpace
    blog: 'blog.js',

    //Models
    films: 'models/films.js',

    //Controllers
    sidebarview: 'views/SidebarView.js',
    filmslistviews: 'views/FilmsListView.js',
    mainview: 'views/MainView.js',
    loginview: 'views/LoginView.js',
    filmview: 'views/FilmView.js',
    adminview: 'views/AdminView.js',
    //Routes
    routes: 'routes.js'

  },

  callback: {
     "films": function() {
      console.log("model loaded ...");
    },
      "sidebarview": function() {
      console.log("sidebarview loaded ...");
    },
     "filmslistview": function() {
      console.log("filmslistview loaded ...");
    },
     "mainview": function() {
      console.log("mainview loaded ...");
    },
     "loginview": function() {
      console.log("loginview loaded ...");
    },
     "filmview": function() {
      console.log("filmview loaded ...");
    },
    "adminview": function() {
      console.log("adminview loaded ...");
    },
    "routes": function() {
      console.log("routes loaded ...");
    }
  },

  complete: function() {
                 $(function (){

                        window.blogFilms = new Blog.Collections.Films();

                        window.mainView = new Blog.Views.MainView({
                            collection: blogFilms
                        });

                       window.adminView = new Blog.Views.AdminView({
                            collection: blogFilms
                          });
                       
                       
                        window.loginView = new Blog.Views.LoginView({
                           adminView: adminView
                         });
                       

                        window.filmView = new Blog.Views.FilmView();


                        window.router = new Blog.Router.RoutesManager({
                            collection: blogFilms
                        });
                       
                        Backbone.history.start();
                       
  
                       $("body").on("click", "p.btn", (function()
                        {
                         alert('o'+$(this).attr("id"));
                            
                            $.ajax({
                                type: "DELETE",
                                 url: "/blogfilms/"+$(this).attr("id"),
                                 error: function(err) {
                                  console.log(err);
                                 },
                                success: function(dataFromServer) {
                                  blogFilms.fetch({
                                    success: function() { mainView.render();}
                                  });
                              }
                            });

                       }));


  



                        }); 
      }
});