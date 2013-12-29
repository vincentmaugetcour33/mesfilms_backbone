var Blog = (function(blog) {

  blog.Views.SidebarView = Backbone.View.extend({
    el: $("#blog_sidebar"),
    initialize: function() {
      this.template = _.template($("#blog_sidebar_template").html());
    },
    render: function() {
      var renderedContent = this.template({films: this.collection.models});
      this.$el.html(renderedContent);
    }
  });

  return blog;
}(Blog));