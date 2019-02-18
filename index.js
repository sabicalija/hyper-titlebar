"use strict";

const isWin = process.platform === "win32";
const { remote } = require("electron");
let dirname = __dirname;

if (isWin == true) {
  dirname = dirname.replace(/\\/g, "/");
}

exports.decorateConfig = config => {
  const windowControls = config.showWindowControls;

  if (windowControls === false) {
    return config;
  }

  const titleBarConfig = {
    iconSize: "16px",
    height: "26px",
    headerBg: "#2f343f",
    closeBg: "#f25056",
    minimizeBg: "#fac536",
    maximizeBg: "#39ea49",
    borderColor: "#000"
  };

  let isLeft = windowControls === "left";
  let isFlipped = isLeft;

  const radius = 20;
  const padding = 5;

  const controlGroupWidth = 4 * padding + 3 * radius;
  const controlGroupHeight = 2 * padding + radius;

  const closeColor = "#f25056";
  const minimizeColor = "#fac536";
  const maximizeColor = "#39ea49";

  return Object.assign({}, config, {
    css: `
      ${config.css || ""}
      .header_windowHeader {
        height: ${controlGroupHeight}px;
        left: ${isLeft ? `${controlGroupWidth}px` : "0"};
        // width: calc(100% - ${controlGroupWidth}px);
        width: 100%;
      }
      // .header_shape {
      // .header_windowControls {
      .header_windowHeader {
        visibility: hidden;
      }
      .header_appTitle {
        margin-left: -56px;
      }
      .mac_header {
        position: fixed;
        top: 0;
        ${isLeft ? "left: 0;" : "right: 0;"}
        height: ${controlGroupHeight}px;
        width: ${controlGroupWidth}px;
      }
      .mac_actions {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
      }
      .mac_header .mac_close,
      .mac_header .mac_minimize,
      .mac_header .mac_maximize {
        z-index: 1000;
        width:  ${radius}px;
        height: ${radius}px;
        border-radius: 50%;
        position: absolute;
        top: 5px;
        background-posiition: -6px;
      }
      .mac_header .mac_close {
        background-color: ${closeColor};
        ${isFlipped ? "left" : "right"}: ${padding}px;
      }
      .mac_header .mac_close:hover {

      }
      .mac_header .mac_minimize {
        background-color: ${minimizeColor};
        left: ${2 * padding + radius}px;
      }
      .mac_header .mac_minimize:hover {

      }
      .mac_header .mac_maximize {
        background-color: ${maximizeColor};
        ${isFlipped ? "right" : "left"}: ${padding}px;
      }
      .mac_header .mac_maximize:hover {
        
      }
    `
  });
};

exports.decorateHeader = (Hyper, { React }) => {
  // React.Children.map(Hyper, x => {
  //   console.log(x);
  // });

  let a = React.Children.toArray(Hyper);
  console.log(a);

  let w = remote.getCurrentWindow();
  console.log(w);

  return class extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        window: null,
        maximized: false
      };

      this.closeApp = this.closeApp.bind(this);
      this.minimizeApp = this.minimizeApp.bind(this);
      this.maximizeApp = this.maximizeApp.bind(this);
    }

    closeApp() {
      this.state.window.close();
    }

    minimizeApp() {
      this.state.window.minimize();
      this.state.maximized = false;
    }

    maximizeApp() {
      if (this.state.maximized == true) {
        this.state.window.unmaximize();
        this.state.maximized = false;
      } else {
        this.state.window.maximze();
        this.state.maximized = true;
      }
    }

    render() {
      return React.createElement(
        Hyper,
        Object.assign({}, this.props, {
          customChildren: React.createElement(
            "div",
            { className: "mac_header" },
            React.createElement(
              "div",
              { className: "mac_actions" },
              React.createElement("span", {
                className: "mac_close",
                onClick: () => {
                  this.closeApp;
                }
              }),
              React.createElement("span", {
                className: "mac_minimize",
                onClick: () => {
                  this.minimizeApp;
                }
              }),
              React.createElement("span", {
                className: "mac_maximize",
                onClick: () => {
                  this.maximizeApp;
                }
              })
            )
          )
        })
      );
    }

    componentDidMount() {
      this.state.window = remote.getCurrentWindow();
    }
  };
};
