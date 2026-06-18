# BBIS Documentation Repository - Developer Guide

## Repository Overview

This repository contains the **Blackbaud Internet Solutions (BBIS) Developer Documentation** site built with Jekyll 4.4.1. It's a static site generator project hosted on GitHub Pages with multi-environment support (GitHub Pages, Development, Production).

**Repository**: https://github.com/blackbaud-community/developer.blackbaud.com-bbis  
**Branch**: development-branch  
**Local Path**: `C:\Projects\BBIS\`

---

## Quick Start (Windows)

### Prerequisites
- Ruby 3.x with DevKit ([Download](https://rubyinstaller.org/))
- Git
- Text editor (Visual Studio, VS Code, etc.)

### Initial Setup

```powershell
# Clone the repository
cd C:\Projects
git clone https://github.com/blackbaud-community/developer.blackbaud.com-bbis BBIS
cd BBIS
git checkout development-branch

# Install Jekyll and dependencies
gem install jekyll -v 4.4.1
gem install bundler
bundle install
```

### Serve Locally (Development)

```powershell
# Fast build (excludes BBNCExtensions - recommended for development)
jekyll serve --config _config.yml,_config.dev.yml

# Access at: http://localhost:4000
```

### Build for Production

```powershell
# Full production build
jekyll build --config _config.yml,_config.prod.yml

# Output location: _published/bbis/
```

### Clean Generated Files

```powershell
jekyll clean
```

---

## Project Architecture

### High-Level Structure

```
C:\Projects\BBIS\
??? _config.yml              # Base configuration (all environments)
??? _config.dev.yml          # Development overrides (localhost)
??? _config.prod.yml         # Production overrides (published site)
??? Gemfile                  # Ruby dependencies
??? index.html               # Homepage
?
??? _layouts/                # Page templates
?   ??? compress.html        # Top-level: HTML minification
?   ??? base.html            # Master template (nav, footer, head)
?   ??? home.html            # Clean layout (homepage)
?   ??? default.html         # Content pages with optional sidebar
?   ??? guide.html           # Developer guides
?
??? _includes/               # Reusable HTML fragments
?   ??? vars.html            # URL parsing (section/subsection)
?   ??? body-carousel.html   # Homepage carousel
?   ??? body-css.html        # CSS loader
?   ??? sidebar-*.html       # Navigation sidebars
?   ??? assets/              # Inlined CSS/JS
?
??? assets/                  # Static files
?   ??? css/                 # Stylesheets
?   ??? js/                  # JavaScript
?   ??? img/                 # Images
?   ??? lib/                 # Third-party libraries
?
??? start/                   # Getting Started section
??? guide/                   # Developer Guide section
??? reference/               # Technical Reference section
??? code/                    # Code Samples section
??? help/                    # Help/Support section
?
??? _utilities/              # Build tools (Sandcastle, converters)
??? _site/                   # Generated site (dev) - excluded from Git
??? _published/              # Generated site (prod) - excluded from Git
```

### Layout Hierarchy

```
compress.html (HTML minification)
  ??? base.html (navbar, footer, Google Analytics)
      ??? home.html (homepage - no sidebar)
      ??? default.html (content + optional sidebar)
          ??? guide.html (forces sidebar-guide.html)
```

### URL to Folder Mapping

| URL Path | Source Folder | Layout | Sidebar |
|----------|---------------|--------|---------|
| `/` | `index.html` | `home` | None (carousel) |
| `/start/` | `start/` | `default` | `sidebar.html` |
| `/guide/` | `guide/` | `guide` | `sidebar-guide.html` |
| `/reference/` | `reference/` | `default` | Various |
| `/code/` | `code/` | `default` | None |
| `/help/` | `help/` | `default` | None |

---

## Configuration Files

### `_config.yml` (Base Config)

Used by all environments. Key settings:

```yaml
title: BBIS Developer Documentation
url: http://blackbaud-community.github.io
baseurl: /developer.blackbaud.com-bbis
highlighter: rouge
timezone: "-05:00"
compress: true

gems:
  - jekyll-redirect-from  # URL redirects

css: [...]  # External and local CSS files
js: [...]   # External and local JS files

defaults:
  - scope:
      path: ""
    values:
      layout: "default"
      sidebar: ""
      carousel: false
```

### `_config.dev.yml` (Development)

Overrides for local development:

```yaml
url: http://localhost:4000
exclude: [reference/bbncextensions]  # Excludes 1,700 files for speed
compress: false                       # Easier debugging
timezone: America/Chicago
```

**Why exclude BBNCExtensions?** The .NET Assembly documentation has ~1,700 auto-generated files. Building takes 2-5 minutes. Excluded in dev for faster builds (~30 seconds).

### `_config.prod.yml` (Production)

Overrides for production builds:

```yaml
url: http://developer.blackbaud.com
baseurl: /bbis
destination: _published/bbis/
exclude: [CONTRIBUTING.md, Gemfile, LICENSE, README.md]
```

---

## Dependencies (Gemfile)

```ruby
gem 'jekyll', '4.4.1'          # Static site generator
gem 'jekyll-redirect-from'     # URL redirect support
gem 'rouge'                     # Syntax highlighting
gem "tzinfo"                    # Timezone support
gem "tzinfo-data", platforms: [:mingw, :x64_mingw, :mswin]  # Windows timezone DB
```

### Windows-Specific Dependencies

- **`tzinfo-data`**: Windows doesn't have IANA timezone database built-in
- **`eventmachine`**: File watcher for auto-rebuild (installed with Jekyll)
- **`ffi`**: Native extensions support on Windows

---

## Content ? Pages Flow

### The Build Pipeline

```
1. Source File (Markdown/HTML)
   ?
2. Front Matter Parsed (YAML between --- delimiters)
   ?
3. Liquid Templates Processed ({{ }}, {% %})
   ?
4. Layout Applied (_layouts/guide.html, etc.)
   ?
5. Parent Layout Applied (_layouts/default.html)
   ?
6. Grandparent Layout Applied (_layouts/base.html)
   ?
7. Root Layout Applied (_layouts/compress.html)
   ?
8. Final HTML Generated ? _site/ directory
```

### Example: Creating a New Guide Page

**File**: `guide/my-new-guide/index.html`

```html
---
layout: guide
section-header: My New Guide
title: My New Guide
---

<h2 id="introduction">Introduction</h2>
<p>This is my new guide content...</p>

<h2 id="setup">Setup</h2>
<p>Follow these steps...</p>
```

**Result**: Accessible at `http://localhost:4000/guide/my-new-guide/`

### Front Matter Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `layout` | Which layout to use | `layout: guide` |
| `section-header` | Page header text | `section-header: Developer Guide` |
| `title` | Browser title | `title: Advanced Donation Form` |
| `sidebar` | Sidebar include file | `sidebar: sidebar.html` |
| `sidebarRelative` | Use relative include | `sidebarRelative: true` |
| `carousel` | Show homepage carousel | `carousel: true` |

---

## Key Includes Explained

### `_includes/vars.html`

Parses the current URL to extract `section` and `subsection` variables:

```liquid
{% assign url_parts = page.url | split: "/" %}
{% for part in url_parts %}
  {% if forloop.index0 == 1 %}
    {% assign section = part %}      # e.g., "guide"
  {% endif %}
  {% if forloop.index0 == 2 %}
    {% assign subsection = part %}   # e.g., "advanced-donation-form"
  {% endif %}
{% endfor %}
```

**Used For**: Active navigation highlighting, conditional content.

### `_includes/body-carousel.html`

Homepage rotating carousel with 3 slides:
- Slide 0: Developer Guide
- Slide 1: Technical References
- Slide 2: GitHub Code Samples
- Slide 3: Developer Network

### `_includes/sidebar-guide.html`

Navigation menu for Developer Guide section. Auto-highlights active page and expands sub-sections.

---

## Common Development Tasks

### 1. Edit Existing Page Content

**Example**: Update Advanced Donation Form guide

```powershell
# 1. Open file
code guide/advanced-donation-form/index.html

# 2. Make changes to HTML content

# 3. Save file (Jekyll auto-rebuilds)

# 4. Refresh browser at http://localhost:4000/guide/advanced-donation-form/
```

### 2. Add New Navigation Link

**Top Navigation** (`_layouts/base.html`, lines 76-103):

```html
<li {% if section == 'mynewsection' %}class="active"{% endif %}>
  <a href="{{ site.baseurl }}/mynewsection/">
    My New Section
  </a>
</li>
```

**Sidebar** (e.g., `_includes/sidebar-guide.html`):

```html
<li class="{% if subsection == 'my-new-page' %} active {% endif %}">
  <a href="{{ site.baseurl }}/guide/my-new-page/">My New Page</a>
</li>
```

### 3. Modify Styling

**CSS Location**: `_includes/assets/css/app.css`

```css
/* Example: Change navbar background */
.navbar {
  background-color: #2c3e50; /* Dark blue-gray */
}
```

**Verify**: Check `_site/assets/css/combine.site.css` after rebuild.

### 4. Update Homepage Carousel

**File**: `_includes/body-carousel.html`

Edit slides (`.slide-00`, `.slide-01`, `.slide-02`, `.slide-03`) to change:
- Heading text
- Description
- Button text and link
- Images

### 5. Add Images/Assets

```powershell
# 1. Copy image to assets/img/
copy myimage.jpg assets/img/

# 2. Reference in content
<img src="{{ site.baseurl }}/assets/img/myimage.jpg" alt="Description" class="img-responsive" />
```

---

## Windows-Specific Troubleshooting

### Issue: "Invalid date" Error

**Cause**: Windows lacks IANA timezone database

**Fix**:
```powershell
bundle install  # Installs tzinfo-data gem
```

### Issue: File Watcher Crashes

**Cause**: Windows file system quirks with `eventmachine`

**Fix**:
```powershell
gem install eventmachine --platform=ruby
```

### Issue: Slow Builds (2-5 minutes)

**Cause**: BBNCExtensions folder has 1,700+ files

**Fix**: Use dev config (already excludes BBNCExtensions)
```powershell
jekyll serve --config _config.yml,_config.dev.yml
```

### Issue: Changes Not Appearing

**Solutions**:
1. Hard refresh browser: `Ctrl + F5`
2. Clear browser cache
3. Stop/restart Jekyll server
4. Check terminal for rebuild confirmation

### Issue: Port 4000 Already in Use

**Fix**: Use different port
```powershell
jekyll serve --config _config.yml,_config.dev.yml --port 4001
```

### Issue: Permission Denied on _site/

**Cause**: Antivirus scanning build output

**Fix**: Exclude `C:\Projects\BBIS\_site\` from real-time antivirus scanning

---

## Build Environment URLs

| Environment | URL | Baseurl | Output Directory |
|-------------|-----|---------|------------------|
| **GitHub Pages** | `http://blackbaud-community.github.io/developer.blackbaud.com-bbis/` | `/developer.blackbaud.com-bbis` | `_site/` (automatic) |
| **Development** | `http://localhost:4000/` | ` ` (empty) | `_site/` |
| **Production** | `http://developer.blackbaud.com/bbis/` | `/bbis` | `_published/bbis/` |

---

## File Locations Reference

### Configuration
- `_config.yml` - Base config (all environments)
- `_config.dev.yml` - Development overrides
- `_config.prod.yml` - Production overrides
- `Gemfile` - Ruby dependencies
- `Gemfile.lock` - Locked dependency versions

### Layouts (Templates)
- `_layouts/compress.html` - HTML minification wrapper
- `_layouts/base.html` - Master template (nav, footer, head)
- `_layouts/home.html` - Homepage layout
- `_layouts/default.html` - Content pages with sidebar
- `_layouts/guide.html` - Developer guide pages

### Includes (Partials)
- `_includes/vars.html` - URL parsing utility
- `_includes/body-carousel.html` - Homepage carousel
- `_includes/body-css.html` - CSS loader
- `_includes/sidebar-guide.html` - Guide navigation
- `_includes/sidebar-top.html` - Scroll to top link
- `_includes/assets/css/app.css` - Main stylesheet
- `_includes/assets/js/app.js` - Main JavaScript

### Content Sections
- `index.html` - Homepage
- `start/` - Getting Started section
- `guide/` - Developer Guide section
- `reference/` - Technical Reference section
- `code/` - Code Samples section
- `help/` - Help/Support section

### Assets
- `assets/css/` - Compiled CSS files
- `assets/js/` - JavaScript files
- `assets/img/` - Images
- `assets/lib/` - Third-party libraries

---

## Important Commands Cheat Sheet

```powershell
# Install dependencies
gem install jekyll -v 4.4.1
gem install bundler
bundle install

# Serve locally (fast - excludes BBNCExtensions)
jekyll serve --config _config.yml,_config.dev.yml

# Serve locally (full - includes BBNCExtensions)
# First, edit _config.dev.yml and remove: exclude: [reference/bbncextensions]
jekyll serve --config _config.yml,_config.dev.yml

# Build for production
jekyll build --config _config.yml,_config.prod.yml

# Clean generated files
jekyll clean

# Check Jekyll version
jekyll -v

# Update dependencies
bundle update

# Serve on different port
jekyll serve --config _config.yml,_config.dev.yml --port 4001
```

---

## Git Workflow

```powershell
# Check current branch
git status

# Create feature branch
git checkout -b feature/my-new-feature

# Stage changes
git add .

# Commit changes
git commit -m "Add new guide page for XYZ"

# Push to remote
git push origin feature/my-new-feature

# Switch back to development branch
git checkout development-branch

# Pull latest changes
git pull origin development-branch
```

---

## Best Practices

### Content Guidelines
1. **Always use front matter** for pages (at minimum: layout, title)
2. **Use `{{ site.baseurl }}` for internal links** to ensure multi-environment support
3. **Add IDs to headings** for anchor links: `<h2 id="my-section">My Section</h2>`
4. **Keep sidebar navigation in sync** when adding new pages
5. **Test in dev environment** before committing

### Code Style
1. **Match existing indentation** (2 spaces for HTML/Liquid, varies for CSS/JS)
2. **Use semantic HTML5 elements** (`<section>`, `<article>`, `<nav>`)
3. **Follow Bootstrap conventions** (existing site uses Bootstrap 3.2.0)
4. **Add comments only when necessary** (match existing comment style)
5. **Use existing CSS classes** before creating new ones

### Performance
1. **Exclude large folders in dev** (`_config.dev.yml` excludes BBNCExtensions)
2. **Optimize images** before adding to `assets/img/`
3. **Use CDN for popular libraries** (jQuery, Bootstrap, Font Awesome)
4. **Inline critical CSS** (already done in `_includes/assets/css/`)

### Safety Checklist Before Committing
- [ ] Local build succeeds without errors
- [ ] All pages render correctly at `http://localhost:4000`
- [ ] Navigation links work (no 404s)
- [ ] Images load properly
- [ ] Mobile view works (resize browser)
- [ ] No broken internal links
- [ ] Front matter is valid YAML
- [ ] Changes follow existing code style

---

## Resources

### Documentation
- **Jekyll Docs**: https://jekyllrb.com/docs/
- **Liquid Templates**: https://shopify.github.io/liquid/
- **Bootstrap 3 Docs**: https://getbootstrap.com/docs/3.3/
- **Font Awesome 4**: https://fontawesome.com/v4.7.0/

### Repository Links
- **GitHub Repo**: https://github.com/blackbaud-community/developer.blackbaud.com-bbis
- **Live Site**: http://developer.blackbaud.com/bbis/
- **Blackbaud Developer Network**: http://www.bbdevnetwork.com

### Support
- **GitHub Issues**: https://github.com/blackbaud-community/developer.blackbaud.com-bbis/issues
- **Email**: docs@blackbaud.com

---

## Next Steps

1. **Read this entire guide** to understand the project structure
2. **Run local server** using `jekyll serve --config _config.yml,_config.dev.yml`
3. **Explore the codebase** by opening the files listed in "File Locations Reference"
4. **Make a test change** (e.g., edit homepage text) to understand the workflow
5. **Review existing content** in `guide/` and `reference/` folders for examples
6. **Check Git branch** - ensure you're on `development-branch` before making changes

---

**Last Updated**: 2025-01-XX  
**Maintainer**: Blackbaud Community  
**License**: See LICENSE file in repository root
