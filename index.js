"use strict";

const fs = require("fs");
const path = require("path");
const { remote } = require("electron");
const color = require("color");
const { library, dom } = require("@fortawesome/fontawesome-svg-core");
const { fab } = require("@fortawesome/free-brands-svg-icons");
const { far } = require("@fortawesome/free-regular-svg-icons");
const { fas } = require("@fortawesome/free-solid-svg-icons");
library.add(fas, far, fab);
dom.watch();

const configPath = path.join(__dirname, "cfg.json");

function storeConfig(cfg) {
  fs.writeFileSync(configPath, JSON.stringify(cfg));
}

function loadConfig() {
  return JSON.parse(fs.readFileSync(configPath));
}

function loadTitlebarOptions({ titlebar = {} }) {
  const cfg = {
    glare: titlebar.glare || false,
    glareScale: titlebar.glareScale || 0.25,
    iconSize: titlebar.iconSize || "60%",
    buttonRadius: titlebar.buttonRadius || "50%",
    buttonSize: titlebar.buttonSize || "20px",
    height: titlebar.height || "26px",
    headerBg: titlebar.headerBg || "#2f343f",
    closeButtonBg: titlebar.closeButtonBg || "#f25056",
    closeIcon: titlebar.closeIcon || "fas fa-times",
    closeIconCol: titlebar.closeIconCol || "#2f343f",
    minimizeButtonBg: titlebar.minimizeButtonBg || "#fac536",
    minimizeIcon: titlebar.minimizeIcon || "fas fa-minus",
    minimizeIconCol: titlebar.minimizeIconCol || "#2f343f",
    maximizeButtonBg: titlebar.maximizeButtonBg || "#39ea49",
    maximizeIcon: titlebar.maximizeIcon || "fas fa-square",
    maximizeIconCol: titlebar.maximizeIconCol || "#2f343f",
    optionsButtonBg: titlebar.optionsButtonBg || "white",
    optionsIcon: titlebar.optionsIcon || "fas fa-bars",
    optionsIconCol: titlebar.optionsIconCol || "#2f343f",
    borderColor: titlebar.borderColor || "#303030",
    borderHeight: `${parseInt(titlebar.buttonSize) + 14}px`,
    borderRadius: titlebar.borderRadius || false
  };

  storeConfig(cfg);
  return cfg;
}

function iconStyle(btn, col, iconCol, order, marginLeft, opts) {
  return `
    .${btn} {
      background-color: ${col};
      ${
        opts.glare
          ? `
      background-image: radial-gradient(${color(col)
        .lighten(0.3)
        .rgb()}, ${col} ${parseInt(opts.buttonSize) * opts.glareScale}px);
        `
          : ""
      }
      order: ${order};
      margin-right: 5px;
      margin-left: ${marginLeft};
    }
    .${btn}-icon {
      color: ${iconCol};
    }
  `;
}

exports.decorateConfig = config => {
  if (config.showWindowControls == false) return config;
  let isLeft = config.showWindowControls === "left";
  let opts = loadTitlebarOptions(config);

  return Object.assign({}, config, {
    css: `
      ${config.css || ""}
      .terms_terms {
        margin-top: ${opts.borderHeight};
      }
      .header_windowHeader {
        visibility: hidden;
      }
      .header {
        background-color: ${opts.borderColor};
        -webkit-app-region: drag;
        ${
          opts.borderRadius
            ? `
        border-bottom-left-radius: ${parseInt(opts.buttonSize) / 2}px;
        border-bottom-right-radius: ${parseInt(opts.buttonSize) / 2}px;
        `
            : ""
        }

      }
      .actions {
        display: -webkit-flex;
      }
      .actions div {
        -webkit-app-region: no-drag;
        width: ${opts.buttonSize};
        height: ${opts.buttonSize};
        border-radius: ${opts.buttonRadius};
        margin-top: 5px;
        margin-bottom: 7px;
        display: -webkit-flex;
        align-items: center;
      }

      ${iconStyle("close", opts.closeButtonBg, opts.closeIconCol, isLeft ? "1" : "4", isLeft ? "5px" : "5px", opts)}
      
      ${iconStyle("minimize", opts.minimizeButtonBg, opts.minimizeIconCol, isLeft ? "2" : "3", isLeft ? "5px" : "5px", opts)}

      ${iconStyle("maximize", opts.maximizeButtonBg, opts.maximizeIconCol, isLeft ? "3" : "2", isLeft ? "5px" : "auto", opts)}

      ${iconStyle("options", opts.optionsButtonBg, opts.optionsIconCol, isLeft ? "4" : "1", isLeft ? "auto" : "5px", opts)}
      .icon {
        margin: auto;
        display: block;
        width: ${opts.iconSize};
        height: ${opts.iconSize};
      }
      .icon:hover {
        animation: 'fa-spin' 0.4s infinite ease-in;
        animation-iteration-count: 1;
      }
      /*
      .actions-btn:after {
        content: '';
        position: absolute;
        -webkit-app-region: no-drag;
        width: ${opts.buttonSize};
        height: ${parseInt(opts.buttonSize) / 2}px;
        border-radius: ${opts.buttonRadius};
        padding-bottom: ${parseInt(opts.buttonSize) / 2}px;
        display: -webkit-flex;
        align-items: center;
        background: linear-gradient(rgba(255,255,255,0.3), rgba(255,255,255,0.2));
      }*/
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
      this.optionsMenu = this.optionsMenu.bind(this);
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

    optionsMenu() {
      // this.props.openHamoptionsMenu({x: 0, y: 32});
      this.props.openHamburgerMenu({ x: 0, y: 0 });
    }

    render() {
      const opts = loadConfig();
      const titlebar = React.createElement(
        "div",
        { className: "header" },
        React.createElement(
          "div",
          { className: "actions" },
          React.createElement(
            "div",
            { className: "actions-btn close", onClick: this.closeApp },
            React.createElement("i", { className: `icon close-icon ${opts.closeIcon}` })
          ),
          React.createElement(
            "div",
            { className: "actions-btn minimize", onClick: this.minimizeApp },
            React.createElement("i", { className: `icon minimize-icon ${opts.minimizeIcon}` })
          ),
          React.createElement(
            "div",
            { className: "actions-btn maximize", onClick: this.maximizeApp },
            React.createElement("i", { className: `icon maximize-icon ${opts.maximizeIcon}` })
          ),
          React.createElement(
            "div",
            { className: "actions-btn options", onClick: this.optionsMenu },
            React.createElement("i", { className: `icon options-icon ${opts.optionsIcon}` })
          )
        )
      );
      return React.createElement(
        Hyper,
        Object.assign({}, this.props, {
          customChildren: titlebar
        })
      );
    }

    componentDidMount() {
      this.state.window = remote.getCurrentWindow();
    }
  };
};
