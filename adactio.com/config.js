(function() {

var $ = function(selector, node) { return node.querySelector(selector); }
var $$ = function(selector, node) { return node.querySelectorAll(selector); }

Meeko.stuff.extend(Meeko.panner.options, {
	detectView: function(path) {
		if (path.match(/.+/)) return "default";
		return null;
	},
	views: {
		"default": {
			decor: "decor.html",
			preprocess: function(doc, path) {
				Meeko.stuff.forEach($$("link[rel=stylesheet]", doc), function(link) {
					link.parentNode.removeChild(link);
				});
				var main = $("[role=main]", doc);
				var skin = $("#skinselection", main);
				if (skin) {
					main.removeChild(skin.previousElementSibling);
					main.removeChild(skin.nextElementSibling);
					main.removeChild(skin);
				}
				main.parentNode.removeChild(main);
				main.id = "main";
				doc.body.innerHTML = "";
				doc.body.appendChild(main);
			}
		}
	}
});

	
})();