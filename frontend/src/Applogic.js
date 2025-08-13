// import axios from 'axios';
// import fs from 'fs';
// import path from 'path';
export default {
  name: "App",
  data() {
    return {
      pureNetPath: "None",
      hierNetPath: "None",
      alpha: null,
      matrixInput: "",
      graphData: null,
      edgeContributionRank: [],
      edgeRecoverabilityRank: [],
      edges_1: [],
      otherEdges: [],
      rankEdg: false,
      // apiBaseUrl: process.env.NODE_ENV === 'development'
      //   ? 'http://localhost:5000'
      //   : '/api2',
      apiBaseUrl: "https://wusiqi.art/api2",
      // apiBaseUrl: "http://localhost:5000",
      robustness: null,
      invariant: null,
    };
  },
  methods: {
    reset() {
      this.alpha = null;
      this.matrixInput = "";
      this.graphData = null;
      this.edgeContributionRank = [];
      this.edgeRecoverabilityRank = [];
      this.pureNetPath = "None";
      this.hierNetPath = "None";
      this.edges_1 = [];
      this.otherEdges = [];
      this.rankEdg = false;
      this.robustness = null;
      this.invariant = null;
    },
    async visualize() {
      try {
        const response = await fetch(`${this.apiBaseUrl}/parse-matrix`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            matrix: this.matrixInput,
            alpha: this.alpha,
            inx: "visualize",
          }),
        });
        const result = await response.json();
        if (result.error) throw new Error(result.error);

        // Handle the HTML file (if sent as base64/text)
        if (result.file_data) {
          const blob = new Blob([result.file_data], { type: "text/html" });
          const url = URL.createObjectURL(blob);
          this.pureNetPath = url;
        }

        // Use it directly in iframe (no need to save to public/)

        this.showPureNetwork = true;
        if (result.robust == 1) {
          this.robustness = "stable";
        } else {
          this.robustness = "not stable";
        }
        this.invariant = result.invariant;
      } catch (error) {
        console.error("Error parsing matrix:", error);
        alert("Failed to parse matrix. Please try again.");
      }
    },
    rankEdges() {
      this.rankEdg = true;
    },
    async analyze() {
      try {
        const response = await fetch(`${this.apiBaseUrl}/parse-matrix`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            matrix: this.matrixInput,
            alpha: this.alpha,
            inx: "analyze",
          }),
        });
        // const message = await response.json();
        // console.log("Message: ", message);
        // if (message.error) {
        //   alert(message.error);
        //   return;
        // }
        // else {
        //      // Handle the HTML file (if sent as base64/text)
        //       if (result.file_data) {
        //         const blob = new Blob([result.file_data], { type: 'text/html' });
        //         const url = URL.createObjectURL(blob);
        //         this.hierNetPath = url;
        //     }
        //     this.edgeContributionRank = [...(message.edges || [])];
        //     this.otherEdges = [...(message.otherEdges || [])];
        // }
        const result = await response.json();
        if (result.error) throw new Error(result.error);

        // Handle the HTML file (if sent as base64/text)
        if (result.file_data) {
          const blob = new Blob([result.file_data], { type: "text/html" });
          const url = URL.createObjectURL(blob);
          this.hierNetPath = url;
        }
        // Store edge ranking data
        this.edgeContributionRank = result.edges || [];
        this.otherEdges = result.otherEdges || [];
        this.showHierarchicalNetwork = true;
      } catch (error) {
        console.error("Error parsing matrix:", error);
        alert(error);
      }
    },

    renderEdgeAnalysisGraph(graphData) {
      console.log("Rendering Edge Analysis Graph with:", graphData);
    },
    renderNetworkVisualizationGraph(graphData) {
      console.log("Rendering Network Visualization Graph with:", graphData);
    },
    saveHTMLToPublicDir(htmlContent) {
      // Use the File System Access API (browser-based) to save the file
      if ("showSaveFilePicker" in window) {
        window
          .showSaveFilePicker({
            suggestedName: "file.html",
            types: [
              {
                description: "HTML Files",
                accept: { "text/html": [".html"] },
              },
            ],
          })
          .then(async (fileHandle) => {
            const writable = await fileHandle.createWritable();
            await writable.write(htmlContent);
            await writable.close();
            console.log("HTML file saved successfully.");
          })
          .catch((error) => {
            console.error("Error saving HTML file:", error);
          });
      } else {
        console.error("File System Access API not supported in this browser.");
      }
    },
  },
};
