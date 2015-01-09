<?xml version="1.0"?>
<xsl:stylesheet 
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
  xmlns:msxsl="urn:schemas-microsoft-com:xslt"
  xmlns:blackbaud="urn:blackbaud"
  exclude-result-prefixes="blackbaud msxsl" 
  version="1.0">

  <msxsl:script language="C#" implements-prefix="blackbaud">
    <![CDATA[
      // I was lazy:
      // http://stackoverflow.com/questions/2920744/url-slugify-algorithm-in-c
      public string CreateID (string url) {
        var s = RemoveAccent(url);
        s = s.ToLower();
        s = Regex.Replace(s, @"[^a-z0-9\s-]", "");                      // remove invalid characters
        s = Regex.Replace(s, @"\s+", " ").Trim();                       // single space
        s = s.Substring(0, s.Length <= 45 ? s.Length : 45).Trim();      // cut and trim
        s = Regex.Replace(s, @"\s", "-");                               // insert hyphens
        return s.ToLower();
      }
      
      public string CreateUrl (string url) {
        return "#" + CreateID(url);
      }
      
      public string RemoveAccent(string txt) { 
        byte[] bytes = System.Text.Encoding.GetEncoding("Cyrillic").GetBytes(txt); 
        return System.Text.Encoding.ASCII.GetString(bytes); 
      }
      
      public string PrettyPrintJSON(string json) {
        return json.Trim();
      }
    ]]>
  </msxsl:script>
  
  <xsl:output method="html"/>

  <xsl:template match="/api">
    <xsl:apply-templates select="endpoints/endpoint" />
  </xsl:template>

  <xsl:template match="endpoint">

    <h2>
      <xsl:attribute name="id">
        <xsl:value-of select="blackbaud:CreateID(url)" />
      </xsl:attribute>
      <xsl:value-of select="url" />
      <a>
        <xsl:attribute name="href">
          <xsl:value-of select="blackbaud:CreateUrl(url)" />
        </xsl:attribute>
        <i class="fa fa-link"></i>
      </a>
      <small>
        <span class="label label-default">
          <xsl:value-of select="method" />
        </span>
      </small>
    </h2>
    
    <dl>

      <xsl:if test="summary | behavior">
        <dt class="description">Description</dt>
        <dd>
          <xsl:if test="summary">
            <p>
              <xsl:value-of select="summary" />
            </p>
          </xsl:if>
          <xsl:if test="behavior">
            <p>
              <xsl:value-of select="behavior" />
            </p>
          </xsl:if>
        </dd>
      </xsl:if>

      <xsl:if test="parameters">
        <dt class="parameters">Parameters</dt>
        <dd>
          <table class="table table-condensed table-parameters">
            <xsl:apply-templates select="parameters/parameter" />
          </table>
        </dd>
      </xsl:if>

      <xsl:if test="post">
        <dt class="post">Post Body</dt>
        <dd>
          <table class="table table-condensed table-post">
            <xsl:apply-templates select="post/fields" />
            <xsl:if test="post/example">
              <tr class="example-response">
                <td colspan="4">
                  {% highlight javascript %}<xsl:value-of select="blackbaud:PrettyPrintJSON(post/example)" />{% endhighlight %}
                </td>
              </tr>
            </xsl:if>
          </table>
        </dd>
      </xsl:if>
      
      <xsl:if test="responses">
        <dt class="returns">Response</dt>
        <dd>
          <table class="table table-condensed table-responses">
            <xsl:apply-templates select="responses/response" />
          </table>
        </dd>
      </xsl:if>
      
    </dl>

  </xsl:template>

  <xsl:template match="parameter">
    <tr>
      <td class="name">
        <xsl:value-of select="name"/>
      </td>
      <td class="type">
        (<xsl:value-of select="type"/>)
      </td>
      <td class="required">
        <xsl:if test="required = 'true'">
          <span class="label label-default label-required">Required</span>
        </xsl:if>
      </td>
      <td class="description">
        <xsl:value-of select="description" disable-output-escaping="yes" />
      </td>
    </tr>
  </xsl:template>

  <xsl:template match="field">
    <tr>
      <td class="name">
        <xsl:value-of select="name"/>
      </td>
      <td class="type">
        (<xsl:value-of select="type"/>)
      </td>
      <td class="required">
        <xsl:if test="required = 'true'">
          <span class="label label-default label-required">Required</span>
        </xsl:if>
      </td>
      <td class="description">
        <xsl:value-of select="description" disable-output-escaping="yes" />
      </td>
    </tr>
  </xsl:template>

  <xsl:template match="response">
    <tr>
      <td class="status">
        <xsl:value-of select="status" />
      </td>
      <td class="body">
        <xsl:value-of select="body" />
      </td>
      <td class="description">
        <xsl:value-of select="description" disable-output-escaping="yes" />
      </td>
    </tr>

    <xsl:if test="status">
      <xsl:variable name="status" select="status" />
      <xsl:for-each select="../../exampleResponses/exampleResponse">
        <xsl:if test="status = $status">
          <tr class="example-response">
            <td colspan="4">
              {% highlight javascript %}<xsl:value-of select="blackbaud:PrettyPrintJSON(body)" />{% endhighlight %}
            </td>
          </tr>
        </xsl:if>
      </xsl:for-each>
    </xsl:if>

  </xsl:template>

</xsl:stylesheet>