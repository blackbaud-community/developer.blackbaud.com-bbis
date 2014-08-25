<!DOCTYPE html>
<html lang="en">
<head>

  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Blackbaud</title>

  <link rel="icon" href="<?php assets(); ?>blackbaud-bootstrap-theme/img/favicon.ico" type="image/ico">
  <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css">
  <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">
  <link rel="stylesheet" href="<?php assets(); ?>blackbaud-bootstrap-theme/lib/owl-carousel/assets/owl.carousel.min.css">
  <link rel="stylesheet" href="<?php assets(); ?>blackbaud-bootstrap-theme/lib/owl-carousel/assets/owl.theme.default.min.css">
  <link rel="stylesheet" href="<?php assets(); ?>blackbaud-bootstrap-theme/lib/animate/animate.css">
  <link rel="stylesheet" href="<?php assets(); ?>blackbaud-bootstrap-theme/css/blackbaud-bootstrap-theme.css">
  <link rel="stylesheet" href="<?php assets(); ?>css/app.css">

</head>
<body>

  <nav class="navbar" role="navigation">
    <div class="container">

      <div class="navbar-header">
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bb-navbar">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a href="<?php base() ?>" class="navbar-brand">
          <img src="<?php assets(); ?>img/logo-bbis.png" alt="Blackbaud Internet Solutions" class="img-responsive" />
        </a>
      </div>  <!-- navbar-header -->

      <div class="collapse navbar-collapse" id="bb-navbar">
        <ul class="nav navbar-nav navbar-right">
          <li <?php print isActive('getting-started/'); ?>>
            <a href="<?php base() ?>getting-started/">Getting Started</a>
          </li>
          <li <?php print isActive('guide/'); ?>>
            <a href="<?php base() ?>guide/" class="dropdown-toggle" data-toggle="dropdown">
              Developer Guide <span class="caret"></span>
            </a>
            <ul class="dropdown-menu" role="menu">
              <li>
                <a href="<?php base() ?>guide/#custom-content-part">Custom Content Part</a>
              </li>
              <li>
                <a href="<?php base() ?>guide/#custom-framework-part">Custom Framework Part</a>
              </li>
              <li>
                <a href="<?php base() ?>guide/#custom-content-part">More Coming Soon!</a>
              </li>
            </ul>
          </li>
          <li <?php print isActive('reference/'); ?>>
            <a href="<?php base() ?>reference/" class="dropdown-toggle" data-toggle="dropdown">
              Technical Reference <span class="caret"></span>
            </a>
            <ul class="dropdown-menu" role="menu">
              <li>
                <a href="<?php base() ?>reference/#">.NET Assemblies</a>
              </li>
              <li>
                <a href="<?php base() ?>reference/#">REST Web API</a>
              </li>
              <li>
                <a href="<?php base() ?>reference/#">JavaScript SDK</a>
              </li>
            </ul>
          </li>
          <li><a href="#"><i class="fa fa-question-circle"></i></a></li>
        </ul>  <!-- .navbar-nav -->
      </div>  <!-- .navbar-collapse -->

    </div>  <!-- .container -->
  </nav>  <!-- .navbar.navbar-inverse -->

  <?php 
    if ($settings['carousel']) {
      include 'carousel.php';
    }
  ?>