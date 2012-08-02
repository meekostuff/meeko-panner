
(function() {

if (!history.pushState) {
	alert('meeko-panner cannot run: \n\nThis browser doesn\'t support `history.pushState()`');
	return;
}

var decorBase = window.decorBase || 'https://d3g4qkktqnw71.cloudfront.net/meeko-panner/';

var Meeko = window.Meeko || (window.Meeko = {});
Meeko.config = {
	"decor-autostart": false
}

/* some functions for scheduling / loading scripts */
function urlPath(url) {
	var a = document.createElement("a");
	a.href = url;
	return a.pathname;	
}

function loadScript(url, callback) {
	var script = document.createElement('script');
	script.src = url;
	script.onload = callback;
	document.body.appendChild(script);
}

function queue(fnList, callback) {
	var list = [].concat(fnList);
	var queueback = function() {
		var fn = list.shift();
		if (fn) fn(queueback);
		else if (callback) callback();
	}
	queueback();
}

function delay(callback, timeout) {
	window.setTimeout(callback, timeout);
}

/* now do start-up */

queue([
	function(callback) { loadScript(decorBase + 'HTMLDecor.js', callback); },
	init,
	function(callback) { loadScript(decorBase + location.hostname + '/' + 'config.js', callback); },
	start
]);

function init(callback) {

var decor = Meeko.decor, stuff = Meeko.stuff, DOM = Meeko.DOM, Callback = Meeko.Callback,
	extend = stuff.extend, each = stuff.each, forEach = stuff.forEach, words = stuff.words, 
	$id = DOM.$id, $$ = DOM.$$,
	$ = function(selector, context) {
		if (!context) context = document;
		return context.querySelector(selector);
	},
	async = Callback.async;

var panner = Meeko.panner = {}
var options = Meeko.panner.options = {}
var pageCache = {};


function getView(path) {
	return options.views[options.detectView(path)];
}

function preprocess(doc, path) {
	var view = getView(path);
	view.preprocess(doc, path);
	setDecor(doc, decorBase + location.hostname + '/' + view.decor);
	return doc;
}

function setDecor(doc, url) {
	var link = doc.createElement("link");
	link.rel = "meeko-decor";
	link.type = "text/html";
	link.href =  url;
	doc.head.appendChild(link);	
}

function cloneDocument(doc) {
	var clone = document.implementation.createHTMLDocument("");
	clone.removeChild(clone.documentElement);
	clone.appendChild(doc.documentElement.cloneNode(true));
	return clone;
}

function setActiveStylesheet(title) { // see http://www.alistapart.com/articles/alternate/
	function able(node) {
		node.disabled = true;
		if (node.title == title) node.disabled = false;
	}
	forEach($$("link"), function(node) {
		if (!/\bstylesheet\b/.test(node.rel)) return;
		if (!node.title) return;
		able(node);
	});
	forEach($$("style"), function(node) {
		if (!node.title) return;
		able(node);
	});
}

function beforePageIn(newURL, oldURL) {
}

extend(panner, {

getView: getView,
preprocess: preprocess,
setDecor: setDecor,
cloneDocument: cloneDocument,
setActiveStylesheet: setActiveStylesheet,
beforePageIn: beforePageIn

});

/*
 Over-ride url loader to allow javascript caching of pages
*/

	
decor.load = async(function(url, cb) {
	DOM.loadHTML(url, function(doc) {
		rebase(doc);
		cb.complete(doc);
	});
});

function rebase(doc) {
	
	function normalize(tag, attrName) {
		forEach($$(tag, doc), function(el) {
			var relURI = el.getAttribute(attrName);
			if (relURI == null) return;
			var uri = rebaseURI(relURI);
			if (uri != relURI) el[attrName] = uri;
		});
	}
	each(uriAttrs, normalize);

}

function rebaseURI(uri) {
	var pathname = uri.replace(/^base-uri:/, '');
	if (pathname == uri) return uri;
	var link = document.createElement("a");
	link.href = pathname;
	return link.pathname;
}

var uriAttrs = {};
forEach(words("link@href a@href script@src img@src iframe@src video@src audio@src source@src form@action input@formaction button@formaction"), function(text) {
	var m = text.split("@"), tag = m[0], attrName = m[1];
	uriAttrs[tag] = attrName;
});
	

decor.options.load = async(function(url, cb) {
  var pathname = urlPath(url);
  var doc = pageCache[pathname];
  if (doc) return cloneDocument(doc);
  DOM.loadHTML(url, function(doc) {
	preprocess(doc, pathname);
	pageCache[pathname] = cloneDocument(doc);
	cb.complete(doc);
  });
});


var oldURL = '';

// Override default HTMLDecor page nav to implement newURL, oldURL
// FIXME pageIn handlers should already receive these
decor.onSiteLink = function(url) {
	var oldURL = document.URL;
	if (url == oldURL) return false;
	decor.navigate(url);
	return false;
}

decor.configurePaging({
	pageIn: {
		before: function() { beforePageIn(document.URL, oldURL); } 
	}
});

window.addEventListener("submit", onSubmit, false);
function onSubmit(e) {
	e.preventDefault();
	var form = e.target;
	var data = [];
	forEach(form.elements, function(el) {
		data.push(el.name + '=' + encodeURIComponent(el.value));
	});
	var msg = data.join('&');
	if (form.method == 'get') decor.navigate(form.action + '?' + msg);
	else {
		var rq = new XMLHttpRequest;
		rq.open(form.method, form.action, true);
		rq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		rq.send(msg);
	}
}

callback();
} // end init()


function start(callback) {
	document.body.style.visibility = "hidden";
	Meeko.panner.preprocess(document, urlPath(document.URL));
	Meeko.decor.start();
	delay(function() {
		document.body.style.visibility = "";
		callback();
	}, 0);
}

})();
