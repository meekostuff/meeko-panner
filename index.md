**meeko-panner** is a javascript bookmarklet that can enhance a site with 
support for `pushState`-assisted-navigation (panning)
and, optionally, a richer UI. 

The intention is to demonstrate the simplicity, efficiency and flexibility of
an API-first, HTML-payload approach for web-sites.

**meeko-panner** extracts only the essential content of each page and 
uses [HTMLDecor](http://github.com/meekostuff/HTMLDecor) to 
decorate it with shared site decor -
banner, navigation, auxilliary content, styles and layout.
In general this is used to emulate the original appearance and behavior of the site,
except with panning support. 
Another scenario is that a mobile site is enhanced with the appearance of the standard site. 
I consider it obvious that this approach would have better performance and flexibility
if integrated into a site rather than being implemented as a JS bookmarklet. 

More details can be found at the [project site](https://github.com/shogun70/meeko-panner).


Requirements
------------

You need a browser with javascript support enabled. <script type="text/javascript">document.write("Your browser DOES")</script><noscript>Your browser DOES NOT</noscript>  

You need a browser that implements `history.pushState()`. <script type="text/javascript">document.write("Your browser ", !!history.pushState ? "DOES" : "DOES NOT")</script><br />

Recent versions of the following browsers have been tested:

- Chrome
- Safari
- Firefox
- Opera
- Internet Explorer (IE10)


Installation
------------

*Be sure to read the **Notes and Warnings** section*

1. Drag the <a id="meeko-panner" title="meeko-panner" href="javascript:alert('There was a problem on the installation page. Perhaps Javascript isn't enabled');">meeko-panner</a> bookmarklet to the browser's bookmark bar.

	<div id="fallback">
	The URL of the bookmarklet uses the `javascript:` protocol and contais the following code in one line and with `{baseURI}` replaced by the URL of this installation directory. 

	<pre><code id="source" type="text/javascript">
		(function() {
			var script = document.createElement('script');
			script.src = '{baseURI}' + 'boot.js';
			var Meeko = window.Meeko || (window.Meeko = {});
			Meeko.bootScript = script;
			document.body.appendChild(script);
			return;
		})();
	</code></pre>
	</div>
	<script type="text/javascript">
		function $id(id) { return document.getElementById(id); }
		var baseURI = document.URL.replace(/\/[^\/]*$/, '/');
		var source = $id('source');
		var sourceText = source.textContent || source.innerText;
		var url = 'javascript:' + sourceText.replace(/\n\s*/g,' ').replace('{baseURI}', baseURI);
		var bookmarklet = $id('meeko-panner');
		bookmarklet.href = url;
		var fallback = $id('fallback');
		fallback.style.display = 'none';
	</script>

2. Go to a [compatible site](sites/). 

3. Click on the meeko-panner bookmarklet you just installed. 


Notes and Warnings
------------------

- This is a minimally tested and unsupported project. Use at your own risk.

- Features may not work or break without warning. 

- Having said that, if something fails you can usually just refresh the page (and run meeko-panner again).


Contact
-------

If you do find problems, or if you would like to know more, you can contact me at [twitter](https://twitter.com/Meekostuff)
or on [my web-site](http://meekostuff.net).
