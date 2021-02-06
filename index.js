// HTML to PDF
const path = require('path')
const utils = require('util')
const puppeteer = require('puppeteer')
const hb = require('handlebars')

// API
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

async function htmltopdf (htmld, project_name) {
    //const htmld = "<style> h1 {color: maroon; margin-left: 40px;} </style> <h1>hi</h1>";
    let data = {};

    const template = hb.compile(htmld, { strict: true });
    // we have compile our code with handlebars
    const result = template(data);
    // We can use this to add dyamic data to our handlebas template at run time from database or API as per need. you can read the official doc to learn more https://handlebarsjs.com/
    const html = result;

    // we are using headless mode 
    const browser = await puppeteer.launch();
    const page = await browser.newPage()

    // We set the page content as the generated html by handlebars
    await page.setContent(html)

    // we Use pdf function to generate the pdf in the same folder as this file.
    await page.pdf({ path: project_name + '.pdf', format: 'A4' })

    await browser.close();
    console.log("PDF Generated")
}

router.post('/html2pdf',(request,response) => {
    if (!request.body.html) {
        response.end("{'error': 'no html found'}")
        return
    }
    if (!request.body.projectname) {
        response.end("{'error': 'no project name found'}")
        return
    }
    const htmld = request.body.html;
    const project_name = request.body.projectname
    htmltopdf(htmld, project_name);
    //console.log(request.body.html);
    response.end("{'success'}");
});

app.use("/", router);

app.listen(3000, () => {
    console.log("Server running on port 3000");
   });