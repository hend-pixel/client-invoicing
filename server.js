const express = require("express");
const routeDashboard = require("./route-dashboard");
const routeGeneratePdf = require("./route-generate-pdf");
const routeDocusign = require("./route-docusign");

const app = express();
app.use(express.json());

app.get("/", routeDashboard);
app.post("/api/generate-pdf", routeGeneratePdf);
app.post("/api/docusign", routeDocusign);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running on port " + PORT));
