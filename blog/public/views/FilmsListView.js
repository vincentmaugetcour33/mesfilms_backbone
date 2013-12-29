var Blog = (function(blog) {

blog.Views.FilmsListView = Backbone.View.extend({
  el: $("#films_list"),
  initialize: function() {
    this.template = _.template($("#films_list_template").html());
  },
  render: function() {
    var renderedContent = this.template({films: this.collection.models});
    

    this.$el.html(renderedContent);
  }
});

return blog;
}(Blog));