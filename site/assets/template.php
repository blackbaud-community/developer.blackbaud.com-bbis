<?php

define('_BASE', 'http://chs6bobbyear02.blackbaud.global:8080/github/bbBobbyEarl/bbis/site/');
define('_ASSETS', _BASE . 'assets/');

function base() {
  print _BASE;
}

function assets() {
  print _ASSETS;
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

function isActive($url) {
  $dir = pathinfo($_SERVER['PHP_SELF'])['dirname'] . '/';
  $isActive = $url !== '' && substr($dir, -strlen($url)) === $url;
  return $isActive ? ' class="active" ' : '';
}


?>