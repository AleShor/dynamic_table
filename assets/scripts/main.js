function tableInit(){
	"use strict";

	var columns =[
	    {name: 'Column 1'},
	    {name: 'Column 2'},
	    {name: 'Column 3'},
	    {name: 'Column 4'},
	    {name: 'Column 5'},
	    {name: 'Column 6'},
	    {name: 'Column 7'},
	    {name: 'Column 8'}
	];

	var scrollbarWidth = getScrollBarWidth();

	var contentHeight = $(document).height() - (40 + 10 + scrollbarWidth);
	var cellHeight = 32;
	var rowsNum = Math.floor(contentHeight / cellHeight) - 1 + 2;//10
	var columnsNum = 8;
	var limit = rowsNum * columnsNum;
	var offset = 0;
	var view;

	dataDownload(offset, limit, function(data){		
		view = new TableView({
			columns: columns,
			cells: data.result
		});
		view.render().$el.appendTo('.content');
	});
	
	$(".content").scroll(function() {
		var scrollTopH = $(".content").scrollTop();
		var tableH = $("table").outerHeight();
		var contentH = $(".content").height(); //contentH -= contentH % 32;
		var topH = (tableH - contentH);//38
		console.log("scrollTopH = " + scrollTopH + " | topH =  " + topH + " tableH = " + tableH + " contentH = " + contentH);

	    if(scrollTopH >= topH) {
	    	offset = offset+limit;
	    	limit = 10*columnsNum;
	      	dataDownload(offset, limit, function(data){
				view.renderRows(data.result);
		  	});
	    }
	});

	function dataDownload(offset, limit, callback){
		var url = "http://ivsevolod.ru/site/getData?offset="+offset+"&limit="+limit;
	  	$.ajax({
		  url: url,
		  dataType: 'json',
		  success: function(data){
		  	if(typeof callback === 'function'){
		  		callback(data);
		  	}
		  },
		  error: function(){
		  	console.log("Error data load");
		  }
		});
	}

	function getScrollBarWidth() {
	    var inner = document.createElement('p');  
	    inner.style.width = "100%";  
	    inner.style.height = "200px";  
	  
	    var outer = document.createElement('div');  
	    outer.style.position = "absolute";  
	    outer.style.top = "0px";  
	    outer.style.left = "0px";  
	    outer.style.visibility = "hidden";  
	    outer.style.width = "200px";  
	    outer.style.height = "150px";  
	    outer.style.overflow = "hidden";  
	    outer.appendChild (inner);  
	  
	    document.body.appendChild (outer);  
	    var w1 = inner.offsetWidth;  
	    outer.style.overflow = 'scroll';  
	    var w2 = inner.offsetWidth;  
	    if (w1 === w2) {w2 = outer.clientWidth;}
	  
	    document.body.removeChild (outer);  

	    return (w1 - w2);  
	}
}


