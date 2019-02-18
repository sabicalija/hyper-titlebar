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

    closeApp() {}

    minimizeApp() {}

    maximizeApp() {}

    render() {
      return React.createElement(Hyper);
    }

    componentDidMount() {
      this.state.window = remote.getCurrentWindow();
    }
  };
};
