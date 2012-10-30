(function() {

var DOM = Meeko.DOM, $ = DOM.$, $$ = DOM.$$,
    _ = Meeko.stuff;

Meeko.stuff.extend(Meeko.panner.options, {
	detectView: function(path) {
		if (path.match("/javase/7/docs/api/")) return "javase7";
		return null;
	},
	views: {
		"javase7": {
			decor: "decor.html",
			preprocess: function(doc, path) {
				$$("link", doc).forEach(function(el) { if (/stylesheet/i.test(el.rel)) el.parentNode.removeChild(el); })

				var dirs = path.replace('/javase/7/docs/api/', '').split('/');
				var basename = dirs.pop().replace('.html', '');
				var pkg, className;
				if (dirs.length <= 0) {
					type = basename; // overview-summary, overview-tree, deprecated-list
				}
				else {
					var type = dirs[dirs.length-1];
					switch (type) {
					case "index-files":
						break;
					case "class-use":
						dirs.pop();
						pkg = dirs;
						type = "class-use";
						className = basename;
						break;
					default:
						if (/^package-/.test(basename)) type = basename; // package-summary, package-use, package-tree
						else {
							type = 'class';
							className = basename;
						}
						pkg = dirs;
						break;
					}
				}

				var header = doc.createElement("div");
				header.id = "header";
				$$(".header", doc).forEach(function(el) { header.appendChild(el); });
				
				var title = $(".title", header);
				if (title) {
					if (type == 'class' && /^Interface/.test(title.title)) type = 'interface';
					if (type == 'class-use' && /^Uses of Interface/.test(title.title)) type = 'interface-use';
				}
				if (title) {
					var title1 = doc.createElement("div");
					title1.className = "title";
					var innerHTML;
					switch (type) {
					default:
						innerHTML = '<h1>' + title.innerHTML + '</h1>';
						break;
					case "package-summary":
						innerHTML = '<h1>Package <a href="package-summary.html">' + pkg.join('.') + '</a></h1><ul class="contextNav"><li><a href="package-use.html">Use</a></li><li><a href="package-tree.html">Tree</a></li></ul>';
						break;
					case "package-use":
						innerHTML = '<h1>Package <a href="package-summary.html">' + pkg.join('.') + '</a></h1><ul class="contextNav"><li class="navBarCell1Rev"><a href="package-use.html">Use</a></li><li><a href="package-tree.html">Tree</a></li></ul>';
						break;
					case "package-tree":
						innerHTML = '<h1>Package <a href="package-summary.html">' + pkg.join('.') + '</a></h1><ul class="contextNav"><li><a href="package-use.html">Use</a></li><li class="navBarCell1Rev"><a href="package-tree.html">Tree</a></li></ul>';
						break;
					case "class":
						innerHTML = '<h1>Class <a href="' + className + '.html">' + className + '</a></h1><ul class="contextNav"><li><a href="class-use/' + className + '.html">Use</a></li></ul>';
						break;
					case "class-use":
						innerHTML = '<h1>Class <a href="../' + className + '.html">' + className + '</a></h1><ul class="contextNav"><li class="navBarCell1Rev"><a href="' + className + '.html">Use</a></li></ul>';
						break;
					case "interface":
						innerHTML = '<h1>Interface <a href="' + className + '.html">' + className + '</a></h1><ul class="contextNav"><li><a href="class-use/' + className + '.html">Use</a></li></ul>';
						break;
					case "interface-use":
						innerHTML = '<h1>Interface <a href="../' + className + '.html">' + className + '</a></h1><ul class="contextNav"><li class="navBarCell1Rev"><a href="' + className + '.html">Use</a></li></ul>';
						break;
					}
					title1.innerHTML = innerHTML;
					title.parentNode.replaceChild(title1, title);
				}

				var subTitle = $(".subTitle", header);
				if (subTitle) subTitle.parentNode.removeChild(subTitle);

				if (/class|interface/.test(type)) {
					var subTitle1 = doc.createElement("h2");
					subTitle1.className = "subTitle";
					subTitle1.innerHTML = 'Package <a href="' + (/-use/.test(type) ? '../' : '') + 'package-summary.html">' + pkg.join('.') + '</a>';
					title1.parentNode.insertBefore(subTitle1, title1);
				}
				
				var content = $(".contentContainer, .classUseContainer", doc);
				content.parentNode.removeChild(content);
				content.id = "content";
				doc.body.innerHTML = "";
				doc.body.appendChild(header);
				doc.body.appendChild(content);
				$$("a[name]", doc.body).forEach(function(el) { if (!el.id) el.id = el.name; })
			}
		}
	}
});

	
})();