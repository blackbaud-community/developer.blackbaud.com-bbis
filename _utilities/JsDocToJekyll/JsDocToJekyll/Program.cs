using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using HtmlAgilityPack;

namespace JsDocToJekyll {
    class Program {
        static void Main(string[] args) {

            List<string> files = new List<string>();
            List<string> content = new List<string>();

            string output = @"C:\GitReps\Fork\reference\javascript\auto-generated-content.html";
            string root = @"C:\GitReps\Fork\reference\javascript\jsdoc-build\";

            files.Add(root + @"BLACKBAUD.api.CodeTableService.html");
            files.Add(root + @"BLACKBAUD.api.ConsentService.html");
            files.Add(root + @"BLACKBAUD.api.CountryService.html");
            files.Add(root + @"BLACKBAUD.api.DonationService.html");
            files.Add(root + @"BLACKBAUD.api.ImageService.html");
            files.Add(root + @"BLACKBAUD.api.QueryService.html");
            files.Add(root + @"BLACKBAUD.api.UserService.html");

            string formatH2 = "<h2 id=\"{0}-{1}\">{2} <a href=\"#{0}-{1}\"><i class=\"fa fa-link\"></i></a></h2>";
            string formatDT = "<dt class=\"{0}\">{1}</dt>";
            string formatDD = "<dd>{0}</dd>";

            foreach (string file in files) {

                // Create HTML document
                HtmlDocument doc = new HtmlDocument();
                doc.Load(file, Encoding.UTF8);

                // Find service
                string service = doc.DocumentNode.SelectSingleNode("//header/h2").InnerText.Trim().ToLower();

                // Open Div
                content.Add(String.Format("<div id=\"{0}\">", service));

                // Find constructor
                HtmlNode constuctorTitle = doc.DocumentNode.SelectSingleNode("//div[@class='container-overview']/dt/h4");
                HtmlNode constructorDescription = doc.DocumentNode.SelectSingleNode("//div[@class='class-description']");
                HtmlNode constructorParameters = doc.DocumentNode.SelectSingleNode("//div[@class='container-overview']/dd/table[@class='params']");

                if (constuctorTitle != null) {
                    content.Add(String.Format(formatH2, service, "constructor", constuctorTitle.InnerText));
                }

                content.Add("<dl>");

                if (constructorDescription != null) {
                    content.Add(String.Format(formatDT, "description", "Description"));
                    content.Add(String.Format(formatDD, constructorDescription.InnerHtml));
                }

                if (constructorParameters != null) {

                    // Cleanup table
                    constructorParameters.Attributes.Remove("class");
                    constructorParameters.Attributes.Add("class", "table table-condensed table-parameters");
                    constructorParameters.ParentNode.SelectSingleNode("h5").Remove();
                    constructorParameters.ParentNode.SelectSingleNode("dl[@class='details']").Remove();

                    // Removing "code" tags
                    HtmlNodeCollection names = constructorParameters.SelectNodes("tbody/tr/td[@class='name']");
                    if (names != null) {
                        foreach (HtmlNode name in names) {
                            name.InnerHtml = name.InnerText;
                        }
                    }

                    content.Add(String.Format(formatDT, "parameters", "Parameters"));
                    content.Add(String.Format(formatDD, constructorParameters.ParentNode.InnerHtml.Trim()));
                }

                content.Add("</dl>");

                // Find Methods
                HtmlNodeCollection methodTitles = doc.DocumentNode.SelectNodes("//dl/dt/h4[@class='name']");
                HtmlNodeCollection methodDescriptions = doc.DocumentNode.SelectNodes("//dl/dd/div[@class='description']");
                HtmlNodeCollection methodParams = doc.DocumentNode.SelectNodes("//dl/dd/table[@class='params']");

                if (methodTitles.Count == methodDescriptions.Count && methodDescriptions.Count == methodParams.Count) {
                    for (int i = 0; i < methodTitles.Count; i++) { 

                        // Title
                        string[] titleParts = methodTitles[i].InnerText.Split('(');
                        string id = titleParts.Length == 2 ? titleParts[0].ToLower() : (new Guid().ToString());
                        content.Add(String.Format(formatH2, service, id, methodTitles[i].InnerText));
                        content.Add("<dl>");

                        content.Add(String.Format(formatDT, "description", "Description"));
                        content.Add(String.Format(formatDD, methodDescriptions[i].InnerHtml.Trim()));

                        // Cleanup table
                        methodParams[i].Attributes.Remove("class");
                        methodParams[i].Attributes.Add("class", "table table-condensed table-parameters");
                        methodParams[i].ParentNode.SelectSingleNode("h5").Remove();
                        methodParams[i].ParentNode.SelectSingleNode("dl[@class='details']").Remove();
                        methodParams[i].ParentNode.SelectSingleNode("div[@class='description']").Remove();

                        // Removing "code" tags
                        HtmlNodeCollection names = methodParams[i].SelectNodes("tbody/tr/td[@class='name']");
                        if (names != null) {
                            foreach (HtmlNode name in names) {
                                name.InnerHtml = name.InnerText;
                            }
                        }

                        content.Add(String.Format(formatDT, "parameters", "Parameters"));
                        content.Add(String.Format(formatDD, methodParams[i].ParentNode.InnerHtml.Trim()));

                        content.Add("</dl>");
                    }                    
                }

                // Close Div
                content.Add("</div>");
                
            }

            // Create output file

            try {
                File.WriteAllLines(output, content, Encoding.UTF8);
                Console.WriteLine("File successfully written: {0}", output);
            } catch (Exception ex) {
                Console.WriteLine("Error writing file: {0}", output);
            }

            // Pause
            Console.ReadKey(true);
        }
    }
}
