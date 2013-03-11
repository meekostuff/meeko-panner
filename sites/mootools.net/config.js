(function() {

var DOM = Meeko.DOM, $ = DOM.$, $$ = DOM.$$;
var URL = DOM.URL;


Meeko.decor.config({
	lookup: function(url) {
		var oURL = URL(url);
		var path = oURL.pathname;
		if (path.indexOf("/docs/") == 0) return "docs.html";
		return null;
	}
});

Meeko.panner.config({
	normalize: function(doc, details) {
		var oURL = URL(details.url);
		var main = $("#main", doc);
		main.parentNode.removeChild(main);
		var menu = $("#menu", doc);
		menu.parentNode.removeChild(menu);
		doc.body.innerHTML = "";
		doc.body.appendChild(main);
		doc.body.appendChild(menu);		
	}
});

	
})();
