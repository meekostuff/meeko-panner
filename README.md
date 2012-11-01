<style>
html { width: 100%; text-align: center; }
body { width: 72ex; margin: 0 auto; text-align: left; }
abbr { border-bottom: 1px dotted; }
</style>

meeko-panner
=============

**meeko-panner** is a javascript bookmarklet that can enhance a site with 
support for `pushState`-assisted-navigation (panning)
and, optionally, a richer UI. 

The primary motivation for **meeko-panner** is to demonstrate [HTMLDecor](http://github.com/shogun70/HTMLDecor).
I consider it obvious that this approach would have better performance and flexibility
if integrated into a site rather than being implemented as a js bookmarklet. 

<small>(And the goal of HTMLDecor is to facilitate web-pages containing only essential content,
where auxilliary content, styles, even layout can be added from within the browser
in a device and user appropriate manner.)</small>


Requirements
------------

You need a browser with javascript support enabled. Your browser <script>document.write("DOES")</script><noscript>DOES NOT</noscript>

You need a browser that implements `history.pushState()`. Your browser <script>document.write(!!history.pushState ? "DOES" : "DOES NOT")</script>.
<small><b>HTMLDecor doesn't require `pushState` if integrated into a site,
but to use it in a bookmarklet would require the bookmarklet to be run on every page. </b></small>

The following browsers have been tested:

- Chrome 22 (recommended)
- Safari 5.1 / Webkit nightlies
- Firefox 17

IE10 supports `pushState` but has not been tested.


Installation
------------

*Be sure to read the **Notes and Warnings** section*

1. Drag the
<a title="meeko-panner" href="javascript:var decorBase = (location.protocol == 'https:') ? 'https://d3g4qkktqnw71.cloudfront.net/meeko-panner/' : 'http://dist.meekostuff.net/meeko-panner/'; var script=document.createElement('script'); script.src=decorBase + 'loader.js'; document.getElementsByTagName('head')[0].appendChild(script); void(0);">
meeko-panner</a> bookmarklet to your bookmark bar.

2. Go to a supported site. 

3. Click on the meeko-panner bookmarklet you just installed. 


Supported sites
---------------

- [docs.oracle.com](http://docs.oracle.com) (<small>[details](docs.oracle.com/)</small>)
- [m.netmagazine.com](http://m.netmagazine.com) (<small>[details](m.netmagazine.com/)</small>)
- [adactio.com](http://adactio.com) (<small>[details](adactio.com/)</small>)


Notes and Warnings
------------------

- This is a minimally tested and unsupported project. Use at your own risk.

- Features may not work or break without warning. 

- Some sites send different markup to different users, depending on device, region, etc.
So this may not work at all for you even with the browsers I have tested. 

- Having said that, if something fails you can usually just refresh the page (and run meeko-panner again).

- The speed and functionality of **meeko-panner** is limited primarily by the site it is running on. 


TODO
----

- separate XBL into its own project


Contact
-------

If you do find problems, or if you would like to know more, you can contact me at [twitter](https://twitter.com/Meekostuff)
or on [my web-site](http://meekostuff.net).

