using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Xml;
using System.Xml.Xsl;
using Newtonsoft.Json;

namespace WebApiToJekyll {
    class Program {
        static void Main(string[] args) {

            List<string> files = new List<string>();
            List<string> transforms = new List<string>();

            /* PROD
            string root = @"C:\Team_Projects\Infinity\DEV\CRM_Integration\ClassicCMS\Web\Content\Core\Components\WebApi\Platform\";
            files.Add(root + @"CodeTable\CodeTableApi.xml");
            files.Add(root + @"Country\CountryApi.xml");
            files.Add(root + @"Query\QueryApi.xml");
            files.Add(root + @"User\UserApi.xml");
            */

            string root = @"temp-xml-files\";
            files.Add(root + @"CodeTableApi.xml");
            files.Add(root + @"ConsentApi.xml");
            files.Add(root + @"CheckoutApi.xml");
            files.Add(root + @"CountryApi.xml");
            files.Add(root + @"DonationApi.xml");
            files.Add(root + @"ImageApi.xml");
            files.Add(root + @"QueryApi.xml");
            files.Add(root + @"UserApi.xml");

            try {

                XsltSettings settings = new XsltSettings(true, true);
                XslCompiledTransform xslt = new XslCompiledTransform(true);
                xslt.Load("Jekyll.xslt", settings, new XmlUrlResolver());

                foreach (string file in files) {

                    StringWriter writer = new StringWriter();
                    xslt.Transform(file, null, writer);

                    transforms.Add("<div id=\"" + Path.GetFileNameWithoutExtension(file).ToLower() + "\">");
                    transforms.Add(writer.ToString());
                    transforms.Add("</div>");

                    File.WriteAllLines(@"C:\bbisdeveloper\developer.blackbaud.com-bbis-gh-pages\reference\rest\auto-generated-content.html", transforms);
                    Console.WriteLine("Transformed: {0}", Path.GetFileName(file));
                }



            } catch (Exception ex) {
                Console.WriteLine("Error transforming: {0}", ex.Message);
            } finally {
                Console.WriteLine("Press any key to continue.");
                Console.ReadKey(true);
            }
        }
    }
}