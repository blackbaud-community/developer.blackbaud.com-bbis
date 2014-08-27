<?php head(); ?>

<div class="content">
  <div class="container">
    <div class="row">
      
      <div class="col-md-9 col-md-push-3">
        <?php content(); ?>        
      </div>  <!-- .col-md-9 -->
      
      <div class="col-md-3 col-md-pull-9 hidden-xs hidden-sm">
        <div class="sidebar">
          <?php navSidebar(); ?>
        </div>
      </div>  <!-- .col-md-3 -->
      
    </div>  <!-- .row -->
  </div>  <!-- .container -->
</div>  <!-- .content -->

<?php foot(); ?>