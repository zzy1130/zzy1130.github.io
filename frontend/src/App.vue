<template>
  <div id="app" data-v-app>
    <div class="app-container">
      <header>
        <img
          src="./assets/network-frame.svg"
          alt="Network Edge Analyzer Logo"
        />
        <h1>Stability Analyser and Recovery</h1>
      </header>
      <div class="general-container">
        <div class="left-container">
          <div class="panel top-left">
            <h2>Enter Transition Matrix</h2>
            <textarea
              v-model="matrixInput"
              rows="50"
              cols="50"
              placeholder="Enter transition rate matrix(e.g., 0 1 0 ...)"
            ></textarea>
            <div class="alpha-input">
              <p>Target State α:</p>
              <input v-model="alpha" type="number" min="0" max="100" step="1" />
            </div>
            <div class="buttons">
              <button class="reset-button" @click="reset">Reset</button>
              <button class="action-button" @click="visualize">
                Visualize The Network
              </button>
            </div>
          </div>
          <div class="panel top-right">
            <h2>Critical Transition Identification</h2>
            <div id="edge-analysis-graph" class="graph">
              <iframe
                v-if="hierNetPathIdentify !== 'None'"
                :src="hierNetPathIdentify"
                width="90%"
                height="90%"
                style="border-radius: 12px; background-color: #e8e8e8"
              ></iframe>
            </div>
            <button class="action-button" @click="rankEdges">
              Rank Transitions
            </button>
          </div>
        </div>
        <div class="right-container">
          <div class="panel bottom-left">
            <h2>Network Stability Analyser</h2>
            <div
              id="network-visualization-graph"
              class="graph"
              style="height: 331px"
            >
              <iframe
                v-if="pureNetPath !== 'None'"
                :src="pureNetPath"
                width="90%"
                height="90%"
                style="border-radius: 12px; background-color: #e8e8e8"
              ></iframe>
            </div>
            <div
              class="robustness-section"
              style="
                width: 95%;
                margin-top: -16px;
                display: flex;
                flex-direction: row;
                align-items: center;
              "
            >
              <h3>System Stability:</h3>
              <span style="margin-left: 10px; font-size: 18px">
                <span v-if="robustness !== null">{{ robustness }}</span>
                <span v-else>N/A</span>
              </span>
            </div>
            <div
              class="robustness-section"
              style="
                width: 95%;
                margin-top: -30px;
                display: flex;
                flex-direction: row;
                align-items: center;
              "
            >
              <h3>Minimal Recovery Required:</h3>
              <span style="margin-left: 10px; font-size: 18px">
                <span v-if="invariant !== null">{{ invariant }}</span>
                <span v-else>N/A</span>
              </span>
            </div>
            <button
              class="action-button"
              @click="analyze"
              style="margin-top: -45px"
            >
              Analyze
            </button>
          </div>

          <div class="panel bottom-right">
            <div class="rank-section">
              <h3 style="margin-bottom: 0px">Redundant Transitions</h3>
              <span>(whose removal not affecting α-stability)</span>
              <ul v-if="rankEdg == false">
                <!-- <li v-for="(edge, index) in edgeContributionRank" :key="index">
                  {{ edge }}
                </li> -->
                <li v-if="edgeContributionRank.length === 0">e.g. (1, 2)</li>
              </ul>
              <ul v-if="rankEdg == true">
                <span
                  v-for="(edge, index) in edgeContributionRank"
                  :key="index"
                >
                  {{ edge }},
                </span>
              </ul>
            </div>
            <div class="rank-section recov" style="padding-bottom: 37px">
              <h3 style="margin-bottom: 0">Critical Transition Ranking</h3>
              <img
                src="./assets/O-formula.png"
                style="width: 125px; height: 36px"
              />
              <ul>
                <!-- <span v-if="rankEdg==true" v-for="(key, index) in otherEdges" :key="index">
                  {{ key }}></span> -->
                <span
                  v-if="rankEdg == true"
                  v-for="(key, index) in otherEdges"
                  :key="index"
                >
                  {{ key
                  }}<span v-if="index < Object.keys(otherEdges).length - 1">
                    <
                  </span>
                </span>
                <li v-if="otherEdges.length === 0">e.g. (2, 3)<(2, 1)</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="right-container">
          <div class="panel top-right">
            <h2>Network Robustness Analyser</h2>
            <div id="edge-analysis-graph" class="graph">
              <iframe
                v-if="hierNetPath !== 'None'"
                :src="hierNetPath"
                width="90%"
                height="90%"
                style="border-radius: 12px; background-color: #e8e8e8"
              ></iframe>
            </div>
            <button class="action-button" @click="identify">Identify</button>
          </div>
          <div class="panel top-right">
            <h2>Minimal Recovery Strategy</h2>
            <div id="edge-analysis-graph" class="graph">
              <iframe
                v-if="pureNetPathRecover !== 'None'"
                :src="pureNetPathRecover"
                width="90%"
                height="90%"
                style="border-radius: 12px; background-color: #e8e8e8"
              ></iframe>
            </div>
            <button class="action-button" @click="recover">Recover</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppLogic from "./Applogic";

export default AppLogic;
</script>

<style scoped>
@import "./AppStyles.css";
</style>
