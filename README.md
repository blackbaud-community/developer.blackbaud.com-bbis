BBIS
=======================

### Setup Instructions

While the following instructions are all possible on Windows, they are <strong>much</strong> easier using OSX, as many of the requirements are already built-in and linked.

0. Install <a href="http://bundler.io" target="_blank">Bundler</a>.
0. Install <a href="http://nodejs.org/download" target="_blank">NodeJS</a>.
0. Install <a href="https://help.github.com/articles/using-jekyll-with-pages#installing-jekyll" target="_blank">Jekyll</a> by running <code>gem install jekyll</code>.
0. Clone the BBIS repo using one of the following methods:
  - <a href="https://mac.github.com/" target="_blank">GitHub App</a>
  - In terminal, run <code>git clone git://github.com/blackbaud-community/developer.blackbaud.com-bbis.git</code> *Requires <a href="http://git-scm.com/download/mac" target="_blank">git</a>.
0. In terminal, run <code>cd developer.blackbaud.com-bbis</code>
0. In terminal, run <code>bundle install</code>
0. In terminal, run <code>npm install</code>
0. In terminal, run <code>jekyll serve --baseurl ''</code>

You will now be able to visit <a href="http://localhost:4000">http://localhost:4000</a> in your browser to view the site.

If you're not debugging, you could also run <code>jekyll build</code>, which will generate the site and place it into the _site folder.

### Publishing

At present time, we deploy by uploading the contents of the _site directory directly to developer.blackbaud.com/bbis.  Please be aware this configuration may change the future.  For example, with some project restructuring and DNS changes, we could utilize gh-pages free hosting for all our documentation.
