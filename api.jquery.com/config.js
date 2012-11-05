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
				var content = $("#jq-primaryContent", doc);
				content.parentNode.removeChild(content);
				doc.body.innerHTML = "";
				doc.body.appendChild(content);
			}
		}
	}
});

	
})();
