var Blog = (function(blog) {

  blog.Views.FilmView = Backbone.View.extend({
    el: $("#films_list"),
    initialize: function() {
      this.template = _.template($("#film_details_template").html());
    },
    render: function(film) {
      var renderedContent = this.template({ film: film });

      this.$el.html(renderedContent);
    }
  });

  return blog;
  }(Blog));