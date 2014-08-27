<?php require_once(dirname(__FILE__) . '/assets/template.php'); ?>
<?php head(array('carousel' => true)); ?>

<div class="content">
  <div class="container">
    <div class="row">
      <div class="col-sm-12">

        <div class="content-getting-started">
          <div class="row">

            <div class="col-sm-6 content-getting-started-column">
              <h2>Getting Started</h2>
              <p>Blackbaud Internet Services exposes functionality through .NET assemblies, REST APIs, and JavaScript SDK's.  Using these tools allows developers to create rich interactions with your site and real data.</p>
              <p>Blackbaud’s vision of BBIS is to provide a highly flexible and robust Internet platform with a deep integration to BBCRM and feature set.</p>
              <p><a href="getting-started/" class="btn btn-primary btn-lg">Getting Started</a></p>
            </div>  <!-- .col-sm-6 -->

            <div class="col-sm-6 content-getting-started-column">
              <img src="<?php assets() ?>img/static-hero.png" alt="" class="img-responsive" />
            </div>  <!-- .col-sm-6 -->

          </div>  <!-- .row -->
        </div>  <!-- .content-getting-started -->

        <div class="content-latest-features">        
          <div class="row">       

            <div class="col-sm-4">
              <div class="feature">
                <h3><i class="fa fa-cogs pull-right"></i> Create Custom Parts</h3>
                <p>Using .NET assemblies to create Custom Framework Parts or our JavaScript SDK to create Custom Content Parts gives you unbelievable granular control over the user experience.</p>
              </div>  <!-- .feature -->
            </div>  <!-- .col-sm-4 -->   

            <div class="col-sm-4">
              <div class="feature">
                <h3><i class="fa fa-truck pull-right"></i> Enterprise CRM Integration</h3>
                <p>Full integration means you have the ability to safely and securely manipulate all your sensitive constituent data.</p>
              </div>  <!-- .feature -->
            </div>  <!-- .col-sm-4 -->

            <div class="col-sm-4">
              <div class="feature">
                <h3><i class="fa fa-credit-card pull-right"></i> Secure Payments Integration</h3>
                <p>API endpoints exposed in the BBNCExtensions .NET Assembly allows custom parts to utilize the secure payments service.</p>
              </div>  <!-- .feature -->
            </div>  <!-- .col-sm-4 -->

          </div>  <!-- .row -->
          <div class="row hide">
            <div class="col-sm-4">
              <p class="text-center"><a href="#" class="btn btn-default">Learn More About Custom Parts</a></p>
            </div>  <!-- .col-sm-4 -->
            <div class="col-sm-4">
              <p class="text-center"><a href="#" class="btn btn-default">Learn More About the Infinity SDK</a></p>        
            </div>  <!-- .col-sm-4 -->
            <div class="col-sm-4">
              <p class="text-center"><a href="#" class="btn btn-default">Learn More About BBNCExtensions</a></p>
            </div>  <!-- .col-sm-4 -->
          </div> <!-- .row -->
        </div>  <!-- .content-latest-features -->

      </div>  <!-- .col-sm-12 -->
    </div>  <!-- .row -->
  </div>  <!-- .container -->
</div>  <!-- .content -->

<?php include 'assets/partials/footer.php'; ?>