(function() {

var DOM = Meeko.DOM, $ = DOM.$, $$ = DOM.$$,
    _ = Meeko.stuff;

_.extend(Meeko.panner.options, {
	detectView: function(path) {
		if (path.match("/blog/")) return "decor";
		return null;
	},
	views: {
		"decor": {
			decor: "decor.html",
			preprocess: function(doc, path) {
				$$("link", doc).forEach(function(el) { if (/stylesheet/i.test(el.rel)) el.parentNode.removeChild(el); })

				var title = $("h2", doc);
				title.parentNode.removeChild(title);
				title.id = "top";
				
				var meta = doc.createElement("div");
				meta.id = "meta";
				var marker = $("div.floater > ul:first-child", doc);
				if (marker) meta.appendChild(marker);
				
				var main = doc.createElement("div");
				main.id = "main";

				marker = $("#lastModPar", doc); // NOTE added by quirksmode page load scripts
				if (marker) marker.parentNode.removeChild(marker);
				
				var marker = $("div.pageHeader", doc); // NOTE added by quirksmode page load scripts
				if (marker) marker.parentNode.removeChild(marker);
				
				var marker = $("#header", doc);
				if (marker) marker.parentNode.removeChild(marker);
				
				marker = $("div.floater", doc);
				if (marker) marker.parentNode.removeChild(marker);
				
				marker = $("#footer");
				if (marker) marker.parentNode.removeChild(marker);

				for (; marker=doc.body.firstChild;) main.appendChild(marker);
				
				doc.body.appendChild(title);
				doc.body.appendChild(meta);
				doc.body.appendChild(main);
			}
		}
	}
});

	
})();