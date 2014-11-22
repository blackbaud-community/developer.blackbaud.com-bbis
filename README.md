BBIS
=======================

### Setup Instructions

After successfully cloning this repo (and branch), please follow the steps to setup jekyll from https://help.github.com/articles/using-jekyll-with-pages#installing-jekyll.

### Working Locally

When working locally, you can either "build" or "serve."  Anything that's built is stored in the _site folder, which Github is setup to ignore.  The serve command works really well to test things without having to commit.

When serving locally, be certain to pass in the <code>--baseurl</code> flag, followed by an empy string <code>''</code>.  For example, I typically run the following:

<pre>jekyll serve --baseurl '' --destination _site</pre>

You will now be able to visit <a href="http://localhost:4000">http://localhost:4000</a> in your browser to view the site.  You should also notice that the site is being stored and served from the _site directory.  This directory is temporary and any changes are ignored.

### Publishing

At present time, we publish the site via the _published directory.  Building the site for publishing is an almost identical process as working locally, except the changes are tracked.

<pre>jekyll build</pre>
