pageflow.externalLinks.ListItemEmbeddedView = Backbone.Marionette.ItemView.extend({
  template: 'pageflow/external_links/editor/templates/embedded/list_item',

  tagName: 'a',
  className: 'link-item',

  ui: {
    title: '.link-title',
    description: '.link-description',
    thumbnail: '.link-thumbnail',
    tooltip: '.tooltip'
  },

  events: {
    'click': function(event) {
      if (event.currentTarget.target) {
        event.stopPropagation();
      }
      else {
        this.ui.tooltip.show();
        return false;
      }
    },

    'mouseleave': function() {
      this.ui.tooltip.hide();
    },

    'click .tooltip': function() {
      window.open(this.$el.attr('href'), '_blank');
      this.ui.tooltip.hide();
      return false;
    }
  },

  onRender: function() {
    this.listenTo(this.model.get('site'), 'change', this.update);
    this.update();
  },

  update: function() {
    var site = this.model.get('site');

    this.ui.title.text(site.get('title'));
    this.ui.description.html(site.get('description'));
    this.ui.tooltip.hide();

    this.$el.toggleClass('no_text', blank(site.get('title')) && blank(site.get('description')));

    this.$el.attr('href', site.get('url'));
    this.$el.attr('target', site.get('open_in_new_tab') ? '_blank' : null);

    this.updateThumbnailView(site);

    function blank(text) {
      return !text || text.replace(/\s+/g, '').replace(/&nbsp;/g, '') === '';
    }
  },

  updateThumbnailView: function(site) {
    var thumbnail = site.thumbnailFile();

    if (this.currentThumbnail !== thumbnail) {
      this.currentThumbnail = thumbnail;

      if (this.thumbnailView) {
        this.thumbnailView.close();
      }

      if (thumbnail) {
        this.thumbnailView = this.subview(new pageflow.FileThumbnailView({
          model: thumbnail,
          imageUrlPropertyName: 'link_thumbnail_url'
        }));

        this.ui.thumbnail.append(this.thumbnailView.el);
      }
    }
  },
});