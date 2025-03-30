// import axios from 'axios';
// import fs from 'fs';
// import path from 'path';


export default {
    name: 'App',
    data() {
      return {
        pureNetPath: 'None',
        hierNetPath: 'None',
        alpha: null,
        matrixInput: '',
        graphData: null,
        edgeContributionRank: [],
        edgeRecoverabilityRank: [],
        edges_1: [],
        otherEdges: [],
        rankEdg: false,
      };
    },
    methods: {
      reset() {
        this.alpha = null;
        this.matrixInput = '';
        this.graphData = null;
        this.edgeContributionRank = [];
        this.edgeRecoverabilityRank = [];
        this.pureNetPath = 'None';
        this.hierNetPath = 'None';
        this.edges_1 = [];
        this.otherEdges = [];
        this.rankEdg = false;
      },
      async visualize() {
        console.log("Matrix Input before fetch: ", this.matrixInput);
        try {
          const response = await fetch('http://localhost:5000/parse-matrix', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ matrix: this.matrixInput, alpha: this.alpha, inx: 'visualize'
             }),
          });
            const message = await response.json();
            console.log("Message: ", message.message);
            if (message.error) {
              alert(message.error);
              return;
            }
            else {
                this.pureNetPath = '/pure_network.html';
            }
          
        } catch (error) {
          console.error('Error parsing matrix:', error);
          alert('Failed to parse matrix. Please try again.');
        }
      },
      rankEdges() {
        this.rankEdg = true;
      },
    //   async rankEdges() {
    //     if (this.graphData) {
    //       try {
    //         const response = await fetch('http://localhost:5000/rank-contribution', {
    //           method: 'POST',
    //           headers: {
    //             'Content-Type': 'application/json',
    //           },
    //           body: JSON.stringify({ graphData: this.graphData }),
    //         });
    //         const data = await response.json();
    //         this.edgeContributionRank = data.contributionRank;
    //       } catch (error) {
    //         console.error('Error ranking edges (contribution):', error);
    //         alert('Failed to rank edges (contribution). Please try again.');
    //       }
    //     }
    //   },
      async analyze() {
        try {
          const response = await fetch('http://localhost:5000/parse-matrix', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ matrix: this.matrixInput, alpha: this.alpha, inx: 'analyze'
             }),
          });
            const message = await response.json();
            console.log("Message: ", message);
            if (message.error) {
              alert(message.error);
              return;
            }
            else {
                this.hierNetPath = '/hier_network.html';
                this.edgeContributionRank = [...(message.edges || [])];
                this.otherEdges = [...(message.otherEdges || [])];
            }
          
        } catch (error) {
          console.error('Error parsing matrix:', error);
          alert('Failed to parse matrix. Please try again.');
        }
      },

      renderEdgeAnalysisGraph(graphData) {
        console.log('Rendering Edge Analysis Graph with:', graphData);
      },
      renderNetworkVisualizationGraph(graphData) {
        console.log('Rendering Network Visualization Graph with:', graphData);
      },
      saveHTMLToPublicDir(htmlContent) {
        // Use the File System Access API (browser-based) to save the file
        if ('showSaveFilePicker' in window) {
          window
            .showSaveFilePicker({
              suggestedName: 'file.html',
              types: [
                {
                  description: 'HTML Files',
                  accept: { 'text/html': ['.html'] },
                },
              ],
            })
            .then(async (fileHandle) => {
              const writable = await fileHandle.createWritable();
              await writable.write(htmlContent);
              await writable.close();
              console.log('HTML file saved successfully.');
            })
            .catch((error) => {
              console.error('Error saving HTML file:', error);
            });
        } else {
          console.error('File System Access API not supported in this browser.');
        }
      },
    },
  };