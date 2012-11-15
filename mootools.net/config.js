(function() {

var DOM = Meeko.DOM, $ = DOM.$, $$ = DOM.$$;

Meeko.stuff.extend(Meeko.panner.options, {
	detectView: function(path) {
		if (path.indexOf("/docs/") == 0) return "docs";
		return null;
	},
	views: {
		"docs": {
			decor: "docs.html",
			preprocess: function(doc, path) {
				var main = $("#main", doc);
				main.parentNode.removeChild(main);
				var menu = $("#menu", doc);
				menu.parentNode.removeChild(menu);
				doc.body.innerHTML = "";
				doc.body.appendChild(main);
				doc.body.appendChild(menu);
			}
		}
	}
});

	
})();
