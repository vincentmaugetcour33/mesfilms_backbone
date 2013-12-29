var Blog = (function(blog) {

  blog.Views.MainView = Backbone.View.extend({
    initialize: function() {

      this.collection.comparator = function(model) {
        return -(new Date(model.get("date")).getTime());
      }

       this.sidebarView = new blog.Views.SidebarView();
      this.filmsListView = new blog.Views.FilmsListView({
        collection: this.collection
      });

      _.bindAll(this, 'render');
      this.collection.bind('reset', this.render);
      this.collection.bind('change', this.render);
      this.collection.bind('add', this.render);
      this.collection.bind('remove', this.render);
    

    },
    render: function() {

      //this.collection.models = this.collection.models.reverse();
      this.sidebarView.collection = new blog.Collections.Films(this.collection.first(3));
     
      this.sidebarView.render();
      this.filmsListView.render();
    }
  });

  return blog;
}(Blog));