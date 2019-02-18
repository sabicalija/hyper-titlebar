"use strict";

const isWin = process.platform === "win32";
const remote = require("electron").remote;
let dirname = __dirname;

if (isWin == true) {
  dirname = dirname.replace(/\\/g, "/");
}

exports.decorateConfig = config => {
  const windowControls = config.showWindowControls;

  if (windowControls === false) {
    return config;
  }

  let isLeft = windowControls === "left";
  let isFlipped = !ifLeft;

  const conf = Object.assign({}, config, {
    css: `
      ${config.css || ""}
      .header_windowHeader {
        height: 22px;
        left: ${isLeft ? "57px" : "0"};
        width: calc(100% - 56px);
      }
      // .header_windowControls {
        .header_shape {
        display: none;
      }
      .header_appTitle {
        margin-left: -56px;
      }
      .mac_header {
        position: fixed;
        top: 0;
        ${isLeft ? "left: 0;" : "right: 0;"}
        height: 22px;
        width: 56px;
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
        width: 12px;
        height: 12px;
        border-radius: 50%;
        position: absolute;
        top: 5px;
        background-posiition: -6px;
      }
      .mac_header .mac_close {
        background-color: #f25056;
        left: ${isFlipped ? "5px" : "40px"};
      }
      .mac_header .mac_close:hover {

      }
      .mac_header .mac_minimize {
        background-color: #fac536;
        left: 23px;
      }
      .mac_header .mac_minimize:hover {

      }
      .mac_header .mac_maximize {
        background-color: #39ea49;
        left: ${isFlipped ? "40px" : "5px"};
      }
      .mac_header .mac_maximize:hover {
        
      }
    `
  });

  return conf;
};

exports.decorateHeader = (Hyper, { React }) => {
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
              { className: "mac_header" },
              React.createElement("span", { className: "mac_close", onClick: this.closeApp }),
              React.createElement("span", { className: "mac_minimize", onClick: this.minimizeApp }),
              React.createElement("span", { className: "mac_maximize", onClick: this.maximizeApp })
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
