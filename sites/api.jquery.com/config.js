(function() {

var DOM = Meeko.DOM, $ = DOM.$, $$ = DOM.$$;

Meeko.stuff.extend(Meeko.panner.options, {
	detectView: function(path) {
		return "default";
	},
	views: {
		"default": {
			decor: "decor.html",
			preprocess: function(doc, path) {
				Meeko.stuff.forEach($$("link[rel=stylesheet]", doc), function(link) {
					link.parentNode.removeChild(link);
				});
				
				var content = $("#content", doc);
				content.parentNode.removeChild(content);
				doc.body.innerHTML = "";
				doc.body.appendChild(content);
				if (path == '/') doc.body.className += " listing";
			}
		}
	}
});

	
})();
