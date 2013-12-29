var Blog = (function(blog) {

  blog.Models.Film = Backbone.Model.extend({
    urlRoot: "/blogfilms"
  });

  blog.Collections.Films = Backbone.Collection.extend({
    model: blog.Models.Film,
    all: function() {
      this.url = "/blogfilms";
      return this;
    },
    query: function(query) {
      this.url = "/blogfilms/query/" + query;
      return this;
    }
  });

  return blog;
}(Blog));