(function() {

var $ = function(selector, node) { return node.querySelector(selector); }
var $$ = function(selector, node) { return node.querySelectorAll(selector); }

Meeko.stuff.extend(Meeko.panner.options, {
	detectView: function(path) {
		if (path.match("/javase/7/docs/api/")) return "javase7";
		return null;
	},
	views: {
		"javase7": {
			decor: "decor.html",
			preprocess: function(doc, path) {
				var header = doc.createElement("div");
				header.id = "header";
				Meeko.stuff.forEach($$(".header", doc), function(el) { header.appendChild(el); });
				var content = $(".contentContainer", doc);
				content.parentNode.removeChild(content);
				content.id = "content";
				doc.body.innerHTML = "";
				doc.body.appendChild(header);
				doc.body.appendChild(content);
			}
		}
	}
});

	
})();