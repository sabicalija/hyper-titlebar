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
    /* titlebar */
    color: titlebar.color || "#303030",
    height: `${parseInt(titlebar.buttonSize) + 14}px`,
    radius: titlebar.radius || false,
    /* buttons */
    buttonSize: titlebar.buttonSize || "20px",
    buttonRadius: titlebar.buttonRadius || "50%",
    closeButtonBg: titlebar.closeButtonBg || "#f25056",
    minimizeButtonBg: titlebar.minimizeButtonBg || "#fac536",
    maximizeButtonBg: titlebar.maximizeButtonBg || "#39ea49",
    optionsButtonBg: titlebar.optionsButtonBg || "white",
    /* icons */
    iconSize: titlebar.iconSize || "60%",
    closeIcon: titlebar.closeIcon || "fas fa-times",
    minimizeIcon: titlebar.minimizeIcon || "fas fa-minus",
    maximizeIcon: titlebar.maximizeIcon || "fas fa-plus",
    optionsIcon: titlebar.optionsIcon || "fas fa-bars",
    /* icon colors */
    closeIconCol: titlebar.closeIconCol || "#2f343f",
    minimizeIconCol: titlebar.minimizeIconCol || "#2f343f",
    maximizeIconCol: titlebar.maximizeIconCol || "#2f343f",
    optionsIconCol: titlebar.optionsIconCol || "#2f343f",
    /* rotation effect */
    rotateSpeed: titlebar.rotateSpeed || "0.25s",
    /* glare effect */
    glare: titlebar.glare || false,
    glareScale: titlebar.glareScale || 0.25
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
        margin-top: ${opts.height};
      }
      .header_windowHeader {
        visibility: hidden;
      }
      .header {
        background-color: ${opts.color};
        -webkit-app-region: drag;
        ${
          opts.radius
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
        animation: 'fa-spin' ${opts.rotateSpeed} infinite ease-in;
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
