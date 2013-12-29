var Blog = (function(blog) {

  blog.Router.RoutesManager = Backbone.Router.extend({
    initialize: function(args) {
      this.collection = args.collection;
    },
    routes: {
      "film/:id_film": "displayFilm",
     // "delete/:id_film": "removeFilm",
      "*path": "root"
    },

    root: function() {
      this.collection.all().fetch({
        success: function(result) {
          }
      });
    },

    displayFilm: function(id_film) {

      var tmp = new blog.Models.Film({ id: id_film});

      tmp.fetch({
        success: function(result) {
          filmView.render(result);
        }
      });
    }

    /* removeFilm: function(id_film) {

      /*$.ajax({
        type: "DELETE",
        url: "/blogfilms/"+id_film,
        error: function(err) {
          console.log(err);
        },
        success: function(dataFromServer) {
          console.log(dataFromServer);
        }
      });

      var tmp = new blog.Models.Film({ id: id_film});

      tmp.destroy({
        success: function(result) {
          filmView.render(result);
        }
      });
    }*/

});

  return blog;
}(Blog));