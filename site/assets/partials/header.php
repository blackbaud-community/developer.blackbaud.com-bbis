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
  <link rel="stylesheet" href="<?php assets(); ?>blackbaud-bootstrap-theme/lib/tocify/jquery.tocify.css">
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
        <?php navMain(); ?>
      </div>  <!-- .navbar-collapse -->

    </div>  <!-- .container -->
  </nav>  <!-- .navbar.navbar-inverse -->

  <?php 
    if ($settings['carousel']) {
      include 'carousel.php';
    }
  ?>