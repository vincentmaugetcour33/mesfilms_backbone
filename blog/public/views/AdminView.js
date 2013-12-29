var Blog = (function(blog) {

  blog.Views.AdminView = Backbone.View.extend({
    el: $("#admin"),
    initialize: function() {
      this.template = _.template($("#admin_template").html());
      
      this.collection.comparator = function(model) {
        return -(new Date(model.get("date")).getTime());
      }
    },
    render: function() {
      var renderedContent = this.template({ films: this.collection.models});
      this.$el.html(renderedContent);
    },
    events: {
      "click  #btn_update": "onClickBtnUpdate",
      "click  #btn_create": "onClickBtnCreate",
      "click  #btn_send": "sendFilm"
    },

    onClickBtnUpdate: function() {
      var selectedId = $("#film_choice").val(),
        film = this.collection.get(selectedId);

     
      $("#admin > [name='id']").val(film.get("id"));
      $("#admin > [name='acteur']").val(film.get("acteur"));
      $("#admin > [name='realisateur']").val(film.get("realisateur"));
      $("#admin > [name='genre']").val(film.get("genre"));
      $("#admin > [name='titre']").val(film.get("titre"));
      $("#admin > [name='origine']").val(film.get("origine"));
      $("#admin > [name='annee']").val(film.get("annee"));
      $("#admin > [name='commentaire']").val(film.get("commentaire"));
      $("#admin > [name='resume']").val(film.get("resume"));

    },
    onClickBtnCreate: function() {
      $("#admin > [name='id']").val("");
      $("#admin > [name='acteur']").val("");
      $("#admin > [name='realisateur']").val("");
      $("#admin > [name='genre']").val("");
      $("#admin > [name='titre']").val("");
      $("#admin > [name='origine']").val("");
      $("#admin > [name='annee']").val("");
      $("#admin > [name='resume']").val("");
      $("#admin > [name='commentaire']").val("");
    },
    
    sendFilm: function() { 
      var that = this, id = $("#admin > [name='id']").val(), film;

      if (id === "") { 
        film = new Blog.Models.Film();
      } else { 
        film = new Blog.Models.Film({
          id: $("#admin > [name='id']").val()
        });
      }

      film.save({
        titre: $("#admin > [name='titre']").val(),
        realisateur : $("#admin > [name='realisateur']").val() ,
        genre : $("#admin > [name='genre']").val(),
        annee : $("#admin > [name='annee']").val(),
        origine : $("#admin > [name='origine']").val(),
        acteur : $("#admin > [name='acteur']").val(),
        resume : $("#admin > [name='resume']").val(),
        commentaire: $("#admin > [name='commentaire']").val(),
       
      }, {
        success: function() {
         
          that.collection.fetch({
            success: function() {
             
              that.render();
              
            }
          });
        },
        error: function(error) { alert("Vous devez être administrateur !"); }
      });
    }
  });
  return blog;
}(Blog));
