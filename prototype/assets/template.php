<?php
$sitemap = array(
  array(
    'title' => 'Getting Started',
    'url' => 'getting-started/',
    'children' => array(
      array(
        'title' => 'Getting Started',
        'url' => '#getting-started',
        'content' => 'getting-started.htm'
      ),
      array(
        'title' => 'BBIS Understanding',
        'url' => '#bbis-understanding',
        'content' => 'bbis-understanding.htm'
      ),
      array(
        'title' => 'Development Environment',
        'url' => '#development-environment',
        'content' => 'development-environment.htm',
        'children' => array(
          array(
            'title' => 'Blackbaud CRM',
            'url' => '#blackbaud-crm',
            'content' => 'blackbaud-crm.htm'
          ),
          array(
            'title' => 'Blackbaud Internet Solutions',
            'url' => '#blackbaud-internet-solutions',
            'content' => 'blackbaud-internet-solutions.htm'
          ),
          array(
            'title' => 'Infinity SDK',
            'url' => '#infinity-sdk',
            'content' => 'infinity-sdk.htm'
          ),
        )
      )
    )
  ),
  array(
    'title' => 'Developer Guide',
    'url' => 'guide/',
    'children' => array(
      array(
        'title' => 'Custom Content Parts',
        'url' => '#custom-content-parts',
        'content' => 'custom-content-parts.htm',
        'children' => array(
          array(
            'title' => 'Hello World',
            'url' => '#hello-world',
            'content' => 'hello-world.htm'
          ),
          array(
            'title' => 'Featured Image',
            'url' => '#featured-image',
            'content' => 'featured-image.htm'
          ),
          array(
            'title' => 'Query Service Directory',
            'url' => '#query-service-directory',
            'content' => 'query-service-directory'
          )
        )
      ),
      array(
        'title' => 'Custom Framework Parts',
        'url' => '#custom-framework-parts',
        'content' => 'custom-framework-parts.htm',
        'children' => array(
          array(
            'title' => 'Setup',
            'url' => '#setup',
            'content' => 'setup.htm'
          ),
          array(
            'title' => 'Custom Pledge Form',
            'url' => '#custom-pledge-form',
            'content' => 'custom-pledge-form.htm'
          ),
          array(
            'title' => 'Constituent Search',
            'url' => '#constituent-search',
            'content' => 'constituent-search.htm'
          ),
          array(
            'title' => 'Event Registration',
            'url' => '#event-registration',
            'content' => 'event-registration.htm'
          ),
          array(
            'title' => 'Barebone Secure Payments',
            'url' => '#barebone-secure-payments',
            'content' => 'barebone-secure-payments.htm'
          )
        )
      ),
      array(
        'title' => 'How-to Developer Guides',
        'url' => '#how-to',
        'content' => 'how-to.htm',
        'children' => array(
        
        )
      )
    )
  ),
  array(
    'title' => 'Technical Reference',
    'url' => 'reference/',
    'children' => array(
    
    )
  ),
  array(
    'title' => '<i class="fa fa-question-circle hidden-xs"></i><span class="visible-xs-inline">Help</span>',
    'url' => 'help/'
  )  
);

function getBase() {
  $base = '';
  switch ($_SERVER['SERVER_NAME']) {
    case 'localhost':
    case 'chs6bobbyearl02':
    case 'chs6bobbyear02.blackbaud.global':
      $base = 'http://chs6bobbyear02.blackbaud.global:8080/github/bbBobbyEarl/bbis/site/';
    break;
    default:
      $base = 'http://developer.blackbaud.com/bbis/site/';
    break;
  }
  return $base;
}

function getAssets() {
  return getBase() . 'assets/';
}

function base() {
  print getBase();
}

function assets() {
  print getAssets();
}

function head($options = array()) {
  $defaults = array(
    'carousel' => false
  );
  $settings = array_merge($defaults, $options);
  include 'partials/header.php';
}

function foot() {
  include 'partials/footer.php';
}

function layout() {
  include 'partials/layout.php';
}

function isActive($url) {
  $dir = pathinfo($_SERVER['PHP_SELF'])['dirname'] . '/';
  $isActive = $url !== '' && substr($dir, -strlen($url)) === $url;
  return $isActive ? ' class="active" ' : '';
}

function navMain() {
  
  global $sitemap;
  
  $a = array('<ul class="nav navbar-nav navbar-right">');
  foreach ($sitemap as $li) {
    $a[] = '<li' . isActive($li['url']) . '>';
    $a[] = '<a href="' . getBase() . $li['url'] . '">' . $li['title'] . '</a>';
    $a[] = '</li>';
  }
  $a[] = '</ul>';
  
  print implode($a, "");
}

function navSidebar() {
  
  global $sitemap;
  
  $a = array();
  $a[] = '<ul class="nav nav-pills nav-stacked nav-sidebar">';
  foreach ($sitemap as $parent) {
    if (isActive($parent['url']) && is_array($parent['children'])) {
      foreach ($parent['children'] as $li) {
        $a[] = '<li' . isActive($li['url']) . '>';
        $a[] = '<a href="' . $li['url'] . '">' . $li['title'] . '</a>';
        
        if (isset($li['children']) && is_array($li['children'])) {
          $a[] = '<ul class="nav">';
          foreach ($li['children'] as $child) {
            $a[] = '<li>';
            $a[] = '<a href="' . $child['url'] . '">' . $child['title'] . '</a>';
            $a[] = '</li>';
          }
          $a[] = '</ul>';
        }
        
        $a[] = '</li>';
      }
    }
  }
  $a[] = '<li class="back-to-top">';
  $a[] = '<a href="#top">';
  $a[] = '<span class="sr-only">Back to Top</span>';
  $a[] = '<i class="fa fa-chevron-circle-up"></i>';
  $a[] = '</a>';
  $a[] = '</li>';
  $a[] = '</ul>';
  
  print implode($a, "");
}

function content() {
 global $sitemap;
  $a = array();
  
  foreach ($sitemap as $parent) {
    if (isActive($parent['url'])) {
      $a[] = '<h1>' . $parent['title'] . '</h1>';
      $a[] = getContent($parent['url'], $parent);
      if (isset($parent['children']) && is_array($parent['children'])) {
        foreach ($parent['children'] as $child) {
          $a[] = '<h2' . getId($child) . '>' . $child['title'] . '</h2>';
          $a[] = getContent($parent['url'], $child);
          if (isset($child['children']) && is_array($child['children'])) {
            foreach ($child['children'] as $grandchild) {
              $a[] = '<h3' . getId($grandchild) . '>' . $grandchild['title'] . '</h3>';
              $a[] = getContent($parent['url'], $grandchild);
            }
          }
        }
      }
    }
  }
  
  print implode($a, '');
}

function getId($item) {
  return ' id="' . substr($item['url'], 1) . '" ';
}

function getContent($base, $item) {
  $r = '';
  if (isset($item['content'])) {
    $url = '../' . $base . $item['content'];
    if (!file_exists($url)) {
      $r = '<p>Hipster ipsum served up instead of <strong>' . $url . '</strong>.</p>';
      $r .= file_get_contents('../assets/hipsum/p' . rand(1, 10) . '.htm'); 
    } else {
      $r = file_get_contents($url);
    }
  }
  return $r;
}


?>