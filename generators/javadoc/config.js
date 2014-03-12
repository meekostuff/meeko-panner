(function() {

var DOM = Meeko.DOM, $id = DOM.$id, $ = DOM.$, $$ = DOM.$$;
var URL = DOM.URL;

var decorURL = 'decor.html'; // relative to config.js
var javadocBase;

var decor_lookup = function(url) {
	if (!javadocBase) return; // first time
	// FIXME better notification for leaving javadoc-set
	if (url.indexOf(javadocBase) !== 0) return; 
	return decorURL;
}

var decor_detect = function(doc) {
	if (javadocBase) return; // shouldn't be needed. lookup() will be valid

	if (window.frames['classFrame']) {
		alert('This looks like the FRAMES view of a javadoc site. Please switch to the NO FRAMES view and restart javadoc-panner');
		return;
	}

	var overviewLI = $('div.topNav > ul.navList[title=Navigation] > li', doc);
	var noframesLI = $('div.subNav > ul.navList + ul.navList > li + li', doc);

	if (!(overviewLI && /Overview/.test(overviewLI.textContent) && noframesLI && /No\s*Frames/.test(noframesLI.textContent))) {
		alert("This doesn't look like a supported javadoc site. Sorry");
		return;
	}

	var overviewHyperlink = $('a[href]', overviewLI) || $('a[href]', noframesLI);

	var docURL = URL(document.URL);
	var overviewHref = docURL.resolve(overviewHyperlink.getAttribute('href'));

	javadocBase = URL(overviewHref).base; // NOTE `basedir` needed for decor rebase()

	return decorURL;
}

Meeko.decor.config({
	lookup: decor_lookup,
	detect: decor_detect,
	normalize: function(doc) {
		Meeko.decor.rebase(doc, javadocBase);
		var about = $('.aboutLanguage');
		var title = document.title.replace(/^[^\(]*\(\s*/, '').replace(/\s*\)\s*$/, '');
		var decorAbout = $('.aboutLanguage', doc);
		decorAbout.innerHTML = about ?
			about.innerHTML :
			'<strong><em>' + title + '</em></strong>';
	}
});

Meeko.panner.config({
	normalize: function(doc, details) {
		var oURL = URL(details.url);
		var path = oURL.pathname;
		$$("script", doc).forEach(function(el) { if (!el.type || /^text\/javascript/i.test(el.type)) el.parentNode.removeChild(el); })
		$$("link", doc).forEach(function(el) { if (/stylesheet/i.test(el.rel)) el.parentNode.removeChild(el); })
//		$$("style", doc).forEach(function(el) { el.parentNode.removeChild(el); })

		var dirs = oURL.href.replace(javadocBase, '').replace(/#.*$/, '').split('/');
		var basename = dirs.pop().replace('.html', '');
		var pkg, className;
		if (dirs.length <= 0) {
			pageType = basename; // overview-summary, overview-tree, deprecated-list
		}
		else {
			var pageType = dirs[dirs.length-1];
			switch (pageType) {
			case "index-files":
				break;
			case "class-use":
				dirs.pop();
				pkg = dirs;
				pageType = "class-use";
				className = basename;
				break;
			default:
				if (/^package-/.test(basename)) pageType = basename; // package-summary, package-use, package-tree
				else {
					pageType = 'class';
					className = basename;
				}
				pkg = dirs;
				break;
			}
		}
		var supportedPageSubtypes = $('ul.navList[title=Navigation]', doc).textContent.split(/\s+/);
		var supportsUse = supportedPageSubtypes.indexOf('Use') >= 0;
		var supportsTree = supportedPageSubtypes.indexOf('Tree') >= 0;

		var header = doc.createElement("div");
		header.id = "header";
		$$(".header", doc).forEach(function(el) { header.appendChild(el); });
		
		var title = $(".title", header);
		if (title) {
			if (pageType == 'class' && /^Interface/.test(title.title)) pageType = 'interface';
			if (pageType == 'class-use' && /^Uses of Interface/.test(title.title)) pageType = 'interface-use';
		}
		if (title) {
			var title1 = doc.createElement("div");
			title1.className = "title";
			var innerHTML;
			switch (pageType) { // TODO a lot of repetition here
			default:
				innerHTML = '<h1>' + title.innerHTML + '</h1>';
				break;
			case "package-summary":
				innerHTML =
					'<h1>Package <a href="package-summary.html">' + pkg.join('.') + '</a></h1>' +
					'<ul class="contextNav">' +
					(supportsUse ? '<li><a href="package-use.html">Use</a></li>' : '') +
					(supportsTree ? '<li><a href="package-tree.html">Tree</a></li>' : '') +
					'</ul>';
				break;
			case "package-use":
				innerHTML =
					'<h1>Package <a href="package-summary.html">' + pkg.join('.') + '</a></h1>' +
					'<ul class="contextNav">' +
					'<li class="navBarCell1Rev"><a href="package-use.html">Use</a></li>' +
					(supportsTree ? '<li><a href="package-tree.html">Tree</a></li>' : '') +
					'</ul>';
				break;
			case "package-tree":
				innerHTML =
					'<h1>Package <a href="package-summary.html">' + pkg.join('.') + '</a></h1>' +
					'<ul class="contextNav">' +
					(supportsUse ? '<li><a href="package-use.html">Use</a></li>' : '') +
					'<li class="navBarCell1Rev"><a href="package-tree.html">Tree</a></li>' +
					'</ul>';
				break;
			case "class":
				innerHTML =
					'<h1>Class <a href="' + className + '.html">' + className + '</a></h1>' +
					'<ul class="contextNav">' +
					(supportsUse ? '<li><a href="class-use/' + className + '.html">Use</a></li>' : '') +
					'</ul>';
				break;
			case "class-use":
				innerHTML =
					'<h1>Class <a href="../' + className + '.html">' + className + '</a></h1>' +
					'<ul class="contextNav">' +
					'<li class="navBarCell1Rev"><a href="' + className + '.html">Use</a></li>' +
					'</ul>';
				break;
			case "interface":
				innerHTML =
					'<h1>Interface <a href="' + className + '.html">' + className + '</a></h1>' +
					(supportsUse ? '<ul class="contextNav"><li><a href="class-use/' + className + '.html">Use</a></li></ul>' : '');
				break;
			case "interface-use":
				innerHTML =
					'<h1>Interface <a href="../' + className + '.html">' + className + '</a></h1>' +
					'<ul class="contextNav"><li class="navBarCell1Rev"><a href="' + className + '.html">Use</a></li></ul>';
				break;
			}
			title1.innerHTML = innerHTML;
			title.parentNode.replaceChild(title1, title);
		}

		if (/class|interface/.test(pageType)) { // replace current subTitle - a bare pkg name - with a hyperlink to the pkg page
			var subTitle = $(".subTitle", header);
			if (subTitle) subTitle.parentNode.removeChild(subTitle);

			var subTitle1 = doc.createElement("h2");
			subTitle1.className = "subTitle";
			subTitle1.innerHTML = 'Package <a href="' + (/-use/.test(pageType) ? '../' : '') + 'package-summary.html">' + pkg.join('.') + '</a>';
			title1.parentNode.insertBefore(subTitle1, title1);
		}

		// remove method filtering tabs
		var t0 = $id('t0', doc);
		if (t0) t0.parentNode.innerHTML = t0.innerHTML;
		
		var content = doc.createElement('div');
		content.id = "content";
		$$(".contentContainer, .classUseContainer", doc).forEach(function(el) { content.appendChild(el); });

		var footer = doc.createElement("div");
		footer.id = "footer";
		$$(".footer", doc).forEach(function(el) { footer.appendChild(el); });

		doc.body.innerHTML = "";
		doc.body.appendChild(header);
		doc.body.appendChild(content);
		doc.body.appendChild(footer);
		$$("a[name]", doc.body).forEach(function(el) { if (!el.id) el.id = el.name; })
	}
});

	
})();
