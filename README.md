BBIS
=======================

### Setup Instructions

After successfully cloning this repo (and branch), please follow the steps to setup jekyll from https://help.github.com/articles/using-jekyll-with-pages#installing-jekyll.

### Build Instructions

When working locally, you can either "build" or "serve."  Anything that's built is stored in the _site folder, which Github is setup to ignore.  The serve command works really well to test things without having to commit.

When serving locally, be certain to pass in the <code>--baseurl</code> flag, followed by an empy string <code>''</code>.  For example, I typically run the following:

<pre>jekyll serve --watch --baseurl ''</pre>

<code>--watch</code> allows the server to automatically refresh when a change is detected in your source.
