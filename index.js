"use strict";

const { remote } = require("electron");

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

  return Object.assign({}, config, {
    css: `
      ${config.css || ""}
      .header_windowHeader {
        visibility: hidden;
      }
      .actions {
        display: inline-flex;
      }
      .actions span {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        margin: 5px;
      }
      .close {
        background-color: red;
      }
      .minimize {
        background-color: yellow;
      }
      .maximize {
        background-color: green;
      }
    `
  });
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
        this.state.window.maximize();
        this.state.maximized = true;
      }
    }

    render() {
      const el = React.createElement(
        "div",
        { className: "header" },
        React.createElement(
          "div",
          { className: "actions" },
          React.createElement("span", { className: "close", onClick: this.closeApp }),
          React.createElement("span", { className: "minimize", onClick: this.minimizeApp }),
          React.createElement("span", { className: "maximize", onClick: this.maximizeApp })
        )
      );
      return React.createElement(
        Hyper,
        Object.assign({}, this.props, {
          customChildren: el
        })
      );
    }

    componentDidMount() {
      this.state.window = remote.getCurrentWindow();
    }
  };
};
