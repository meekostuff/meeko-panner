**meeko-panner** is a javascript bookmarklet that can enhance a site with 
support for `pushState`-assisted-navigation (panning)
and, optionally, a richer UI. 

The intention is to demonstrate the simplicity and flexibility of
a [content first](http://adactio.com/journal/4523/) approach for web-sites.

**meeko-panner** extracts only the essential content of each page and 
uses [HTMLDecor](http://github.com/meekostuff/HTMLDecor) to 
decorate it with shared site decor -
banner, navigation, auxilliary content, styles and layout.
In general this is used to emulate the original appearance and behavior of the site,
except with panning support. 
Another scenario is that a mobile site is enhanced with the appearance of the standard site. 
I consider it obvious that this approach would have better performance and flexibility
if integrated into a site rather than being implemented as a JS bookmarklet. 


Requirements
------------

You need a browser with javascript support enabled. <script type="text/javascript">document.write("Your browser DOES")</script><noscript>Your browser DOES NOT</noscript>  

You need a browser that implements `history.pushState()`. <script type="text/javascript">document.write("Your browser ", !!history.pushState ? "DOES" : "DOES NOT")</script><br />

<b>NOTE:</b> HTMLDecor doesn't require `pushState` if integrated into a site,
but to use it in a bookmarklet would require the bookmarklet to be run on every page. 

The following browsers have been tested:

- Chrome 23
- Safari 5.1 / Webkit nightlies
- Firefox 17

IE10 supports `pushState` but has not been tested.


Installation
------------

*Be sure to read the **Notes and Warnings** section*

1. Drag the
<a title="meeko-panner" href="javascript:var decorBase = (location.protocol == 'https:') ? 'https://d3g4qkktqnw71.cloudfront.net/meeko-panner/' : 'http://dist.meekostuff.net/meeko-panner/'; var script=document.createElement('script'); script.src=decorBase + 'loader.js'; document.getElementsByTagName('head')[0].appendChild(script); void(0);">
meeko-panner</a> bookmarklet to your bookmark bar.

2. Go to a [supported site](sites/). 

3. Click on the meeko-panner bookmarklet you just installed. 


Notes and Warnings
------------------

- This is a minimally tested and unsupported project. Use at your own risk.

- Features may not work or break without warning. 

- Some sites send different markup to different users, depending on device, region, etc.
So this may not work at all for you even with the browsers I have tested. 

- Having said that, if something fails you can usually just refresh the page (and run meeko-panner again).

- The speed of **meeko-panner** is limited primarily by the site it is running on. 


TODO
----

- separate XBL into its own project


Contact
-------

If you do find problems, or if you would like to know more, you can contact me at [twitter](https://twitter.com/Meekostuff)
or on [my web-site](http://meekostuff.net).
