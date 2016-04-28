var AppRouter = Backbone.Router.extend({
    routes: {
        "(hello)": "hello",
        "table": "table"
    },
    hello: function(){
      $('.contentHello').show();
      $('.content').hide();
      $("li").removeClass("active");
      $("li:nth-child(1)").addClass("active");
      $('.contentHello').append("<div class='hello'>Hello world!</div>");
    },
    table: function(){
      $('.contentHello').hide();
      $('.content').show();
      $("li").removeClass("active");
      $("li:nth-child(2)").addClass("active");
      tableInit();
    }
});

$(function(){
  var app_router = new AppRouter;
  Backbone.history.start();
});

