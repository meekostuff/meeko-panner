(function() {

var DOM = Meeko.DOM, $ = DOM.$, $$ = DOM.$$;
var URL = DOM.URL;

Meeko.decor.config({
	lookup: function(url) {
		var oURL = URL(url);
		return "decor.html";
	}
});

Meeko.panner.config({
	normalize: function(doc, details) {
		var oURL = URL(details.url);
		Meeko.stuff.forEach($$("link[rel=stylesheet]", doc), function(link) {
			link.parentNode.removeChild(link);
		});
		
		var content = $("#content", doc);
		content.parentNode.removeChild(content);
		doc.body.innerHTML = "";
		doc.body.appendChild(content);
		if (oURL.pathname == '/') doc.body.className += " listing";
	}
});

	
})();
