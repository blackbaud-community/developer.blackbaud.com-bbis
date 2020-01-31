using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using HtmlAgilityPack;
using CommandLine;
using Newtonsoft.Json;
using System.Xml;

namespace SandcastleToJekyll {

    class Options {
        [Option('i', "input", DefaultValue = @"C:\GitReps\Main\_utilities\Sandcastle\BBNCExtensionsOutput\html", HelpText = "Input directory")]
        public string InputDirectory { get; set; }

        [Option('o', "output", DefaultValue = @"C:\GitReps\Main\reference\bbncextensions", HelpText = "Output directory")]
        public string OutputDirectory { get; set; }

        [Option('x', "xml", DefaultValue = @"C:\GitReps\Main\_utilities\Sandcastle\BBNCExtensionsOutput\WebTOC.xml", HelpText = "XML file to convert to JSON")]
        public string FileXML { get; set; }

        [Option('j', "json", DefaultValue = @"C:\GitReps\Main\_data\WebTOC.json", HelpText = "Converted JSON file")]
        public string FileJSON { get; set; }

        [Option('h', "html", DefaultValue = @"C:\GitReps\Main\_includes\sidebar-reference-static.html", HelpText = "Converted HTML file")]
        public string FileHTML { get; set; }

        [Option('s', "sidebar", DefaultValue = false, HelpText = "Include the sidebar")]
        public bool Sidebar { get; set; }

        [Option('b', "breadcrumbs", DefaultValue = true, HelpText = "Include breadcrumbs")]
        public bool Breadcrumbs { get; set; }

    }

    class Program {
        static void Main(string[] args) {
            Options options = new Options();
            if (Parser.Default.ParseArguments(args, options)) {
                ConvertXML(options.FileXML, options.FileJSON, options.FileHTML);
                ConvertHTML(options.InputDirectory, options.OutputDirectory, options.Sidebar, options.FileXML, options.Breadcrumbs);
                Console.ReadKey(true);
            }
        }

        /// <summary>
        /// Generates the JSON and HTML versions of the XML file.
        /// </summary>
        /// <param name="xml"></param>
        /// <param name="json"></param>
        /// <param name="html"></param>
        static void ConvertXML(string xml, string json, string html) {

            Console.WriteLine("XML: {0}", xml);
            XmlDocument doc = new XmlDocument();
            doc.Load(xml);

            // Build JSON
            string converted = JsonConvert.SerializeXmlNode(doc.DocumentElement, Newtonsoft.Json.Formatting.Indented);
            converted = converted.Replace("\"@", "\"_").Replace("\"html/", "\"");

            // Build HTML
            List<string> nav = new List<string>();
            XmlNodeList nodes = doc.DocumentElement.ChildNodes[0].ChildNodes;
            BuildMenu(ref nav, nodes);

            // Write JSON
            try {
                File.WriteAllText(json, converted);
                Console.WriteLine("JSON: {0}", json);
            } catch (Exception ex) {
                Console.WriteLine("Error writing file: {0}", json);
            }

            // Write HTML
            try {
                File.WriteAllLines(html, nav);
                Console.WriteLine("HTML: {0}", html);
            } catch (Exception ex) {
                Console.WriteLine("Error writing file: {0}", html);
            }

        }

        /// <summary>
        /// Builds an HTML menu from the xml nodes passed in.
        /// </summary>
        /// <param name="nav"></param>
        /// <param name="nodes"></param>
        static void BuildMenu(ref List<string> nav, XmlNodeList nodes) {
            nav.Add("<ul>");

            foreach (XmlNode node in nodes) {
                if (node.Attributes["Url"] != null && node.Attributes["Title"] != null) {
                    nav.Add("<li>");
                    nav.Add(String.Format("<a href=\"{0}\">{1}</a>", node.Attributes["Url"].Value.Replace("html/", ""), node.Attributes["Title"].Value));
                    if (node.HasChildNodes) {
                        BuildMenu(ref nav, node.ChildNodes);
                    }
                    nav.Add("</li>");
                }
            }

            nav.Add("</ul>");
        }

        /// <summary>
        /// Converts Sandcastle HTML files to Jekyll HTML files.
        /// </summary>
        /// <param name="input"></param>
        /// <param name="output"></param>
        /// <param name="sidebar"></param>
        /// <param name="xmlPath"></param>
        /// <param name="doBreadcrumbs"></param>
        static void ConvertHTML(string input, string output, bool sidebar, string xmlPath, bool doBreadcrumbs) { 

            Console.WriteLine("Input: {0}", input);
            Console.WriteLine("Output: {0}", output);
            Console.WriteLine("Sidebar: {0}", sidebar.ToString());

            // Validate input directory
            if (!Directory.Exists(input)) {

                Console.WriteLine("ERROR: Input directory doesn't exist.");

            } else {

                // Find all the files in the input directory.
                string[] files = Directory.GetFiles(input);
                //string[] files = "N_*|T_*|G_*".Split('|').SelectMany(filter => Directory.GetFiles(input, filter)).ToArray();
                Console.WriteLine("Files: {0}", files.Length);
                Console.WriteLine("");

                // Open our XML File
                XmlDocument xml = new XmlDocument();
                xml.Load(xmlPath);

                foreach (string file in files) {

                    string filename = Path.GetFileName(file);
                    List<string> content = new List<string>();
                    HtmlDocument doc = new HtmlDocument();

                    // Display message to user
                    Console.Write(".");

                    // Read the content of the file + clean it up
                    doc.Load(file);
                    doc = RemoveAttributes(doc);
                    doc = RemoveImages(doc);
                    doc = FixHeaders(doc);
                    doc = FixTables(doc);
                    doc = RemoveEmptyDivs(doc);
                    doc = RemoveTopLink(doc);

                    // Find our specific DIV
                    HtmlNode nodeSidebar = doc.DocumentNode.SelectSingleNode("//div[@id='leftNav']");
                    HtmlNode nodeContent = doc.DocumentNode.SelectSingleNode("//div[@id='TopicContent']");
                    string nodeSidebarContent = nodeSidebar == null ? "" : nodeSidebar.InnerHtml;
                    string nodeContentContent = nodeContent == null ? "" : nodeContent.InnerHtml;

                    // Open our front-matter
                    content.Add("---");
                    content.Add("layout: reference");
                    content.Add("title: " + xml.SelectSingleNode("//HelpTOCNode[@Url='html/" + filename + "']").Attributes["Title"].Value);

                    // Build breadcrumbs
                    if (doBreadcrumbs) {
                        List<string> breadcrumbs = CreateBreadcrumbs(xml, filename);
                        foreach (string crumb in breadcrumbs) {
                            content.Add(crumb);
                        }
                    }

                    // Close our front-matter
                    content.Add("---");

                    if (sidebar) {
                        content.Add("<div class=\"col-md-8 col-md-push-4\">");
                    }

                    content.Add(nodeContentContent);

                    if (sidebar) {
                        content.Add("</div>");
                        content.Add("<div class=\"col-md-4 col-md-pull-8 hidden-xs hidden-sm\">");
                        content.Add("<div class=\"sidebar\">");
                        content.Add(nodeSidebarContent);
                        content.Add("</div>");
                        content.Add("</div>");
                    }

                    // Create output file
                    try {
                        File.WriteAllLines(output + "\\" + filename, content);
                    } catch (Exception ex) {
                        Console.WriteLine("Error writing file: {0}", file);
                    }
                    
                }
            }

            Console.WriteLine("");
            Console.WriteLine("");
            Console.WriteLine("Successfully migrated content.  Press any key to continue.");
        }

        /// <summary>
        /// Removes the JS event listeners on collapsible spans.
        /// </summary>
        /// <param name="doc"></param>
        /// <returns></returns>
        static HtmlDocument RemoveAttributes(HtmlDocument doc) {

            string[] attributesToRemove = { "onclick", "onkeypress", "tabindex" };
            HtmlNodeCollection spans = doc.DocumentNode.SelectNodes("//span");

            // Make sure we found spans
            if (spans != null) {

                // Manipulate each span
                foreach (HtmlNode span in spans) {

                    // Remove the attributes
                    foreach (string attribute in attributesToRemove) {
                        if (span.Attributes.Contains(attribute)) {
                            span.Attributes[attribute].Remove();
                        }
                    }
                }
            }
            return doc;
        }

        /// <summary>
        /// Removes the "toggle" images in collapsible spans.
        /// </summary>
        /// <param name="doc"></param>
        /// <returns></returns>
        static HtmlDocument RemoveImages(HtmlDocument doc) {

            HtmlNodeCollection images = doc.DocumentNode.SelectNodes("//span[@class='collapsibleRegionTitle']/img[@class='collapseToggle']");
            if (images != null) {
                foreach (HtmlNode image in images) {
                    image.Remove();
                }
            }

            return doc;
        }

        /// <summary>
        /// Adds the bootstrap class "table" to any remaining tables.
        /// It's important to note this runs after FixHeaders which removes a table.
        /// </summary>
        /// <param name="doc"></param>
        /// <returns></returns>
        static HtmlDocument FixTables(HtmlDocument doc) {
            HtmlNodeCollection tables = doc.DocumentNode.SelectNodes("//table");
            if (tables != null) {
                foreach (HtmlNode table in tables) {
                    table.SetAttributeValue("class", "table");
                }
            }
            return doc;
        }

        /// <summary>
        /// Converts the page's table + css header to a real H2
        /// </summary>
        /// <param name="doc"></param>
        /// <returns></returns>
        static HtmlDocument FixHeaders(HtmlDocument doc) {
            HtmlNode td = doc.DocumentNode.SelectSingleNode("//td[@class='titleColumn']");
            HtmlNode table = doc.DocumentNode.SelectSingleNode("//table[@class='titleTable']");
            HtmlNode h2 = HtmlNode.CreateNode("<h2>" + td.InnerHtml + "</h2>");

            table.ParentNode.PrependChild(h2);
            table.Remove();
            return doc;
        }

        /// <summary>
        /// Remove two types of "empty" elements:
        ///  - Those are are empty by only have one child element
        ///  - Those that are empty by trimming to an empty string
        /// </summary>
        /// <param name="doc"></param>
        /// <returns></returns>
        static HtmlDocument RemoveEmptyDivs(HtmlDocument doc) {

            string[] singles = {
                "//div[@id='seeAlsoSection']",
                "//div[@class='collapsibleAreaRegion']/span[@class='collapsibleRegionTitle'][contains(text(), 'Remarks')]",
            };

            string[] empties = {
                "//div[@class='summary']",
                "//span[@class='introStyle']"
            };

            foreach (string selector in singles) {
                HtmlNode node = doc.DocumentNode.SelectSingleNode(selector);
                if (node != null && node.ChildNodes.Count == 1) {
                    node.Remove();
                }
            }

            foreach (string selector in empties) {
                HtmlNodeCollection nodes = doc.DocumentNode.SelectNodes(selector);
                if (nodes != null) { 
                    foreach (HtmlNode node in nodes) {
                        if (node.InnerText == "" || node.InnerText == " ") {
                            node.Remove();
                        }
                    }
                }
            }

            return doc;
        }

        static HtmlDocument RemoveTopLink(HtmlDocument doc) {
            HtmlNodeCollection links = doc.DocumentNode.SelectNodes("//a[@href='#PageHeader']");
            if (links != null) {
                foreach (HtmlNode a in links) {
                    a.Remove();
                }
            }
            return doc;
        }

        /// <summary>
        /// Creates YAML front-matter array representing page hierarchy or "breadcrumbs."
        /// Does this by finding the current page in the XML TOC and traversing its parents.
        /// </summary>
        /// <param name="xml">XML TOC</param>
        /// <param name="filename">URL to find in TOC</param>
        /// <returns></returns>
        static List<string> CreateBreadcrumbs(XmlDocument xml, string filename) {

            List<string> crumbs = new List<string>();
            XmlNode node = xml.SelectSingleNode("//HelpTOCNode[@Url='html/" + filename + "']");

            if (node != null) {
                crumbs.Add("breadcrumbs:");
                while (node.ParentNode != null && node.ParentNode.Attributes["Title"] != null) {
                    node = node.ParentNode;
                    crumbs.Add(" - title: " + node.Attributes["Title"].Value);
                    crumbs.Add("   url: " + node.Attributes["Url"].Value.Replace("html/", ""));
                }
            }

            return crumbs;
        }
    }
}
