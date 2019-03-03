"use strict";

const fs = require("fs");
const path = require("path");
const { remote } = require("electron");
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
    buttonRadius: titlebar.buttonRadius || "50%",
    buttonSize: titlebar.buttonSize || "16px",
    height: titlebar.height || "26px",
    headerBg: titlebar.headerBg || "#2f343f",
    closeBg: titlebar.closeBg || "#f25056",
    closeIcon: titlebar.closeIcon || "fas fa-times",
    minimizeButtonBg: titlebar.minimizeButtonBg || "#fac536",
    minimizeIcon: titlebar.minimizeIcon || "fas fa-minus",
    maximizeButtonBg: titlebar.maximizeButtonBg || "#39ea49",
    maximizeIcon: titlebar.maximizeIcon || "far fa-square",
    optionsButtonBg: titlebar.optionsButtonBg || "white",
    optionsIcon: titlebar.optionsIcon || "fab fa-rebel",
    borderColor: titlebar.borderColor || "#303030",
    borderHeight: `${parseInt(titlebar.buttonSize) + 14}px`,
    borderRadius: titlebar.borderRadius || false
  };

  storeConfig(cfg);
  return cfg;
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
      .close {
        background-color: ${opts.closeBg};
        order: ${isLeft ? "1" : "4"};
        margin-right: 5px;
        margin-left: 5px;
      }
      .minimize {
        background-color: ${opts.minimizeButtonBg};
        order: ${isLeft ? "2" : "3"};
        margin-right: 5px;
        margin-left: 5px;
      }
      .maximize {
        background-color: ${opts.maximizeButtonBg};
        order: ${isLeft ? "3" : "2"};
        margin-right: 5px;
        margin-left: ${isLeft ? "5px" : "auto"};
      }
      .optionsMenu {
        background-color: ${opts.optionsButtonBg};
        order: ${isLeft ? "4" : "1"};
        margin-right: 5px;
        margin-left: ${isLeft ? "auto" : "5px"};
      }
      .icon {
        margin: auto;
        display: block;
        width: 60%;
        height: 60%;
      }
      .icon:hover {
        animation: 'fa-spin' 0.4s infinite ease-in;
        /* animation-name: 'fa-spin'; */
        animation-iteration-count: 1;
      }
      .dummy {
        prefix: 'fas';
        data-icon: 'times';
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
            { className: "close", onClick: this.closeApp },
            React.createElement("i", { className: `icon ${opts.closeIcon}` })
          ),
          React.createElement(
            "div",
            { className: "minimize", onClick: this.minimizeApp },
            React.createElement("i", { className: `icon ${opts.minimizeIcon}` })
          ),
          React.createElement(
            "div",
            { className: "maximize", onClick: this.maximizeApp },
            React.createElement("i", { className: `icon ${opts.maximizeIcon}` })
          ),
          React.createElement(
            "div",
            { className: "optionsMenu", onClick: this.optionsMenu },
            React.createElement("i", { className: `icon ${opts.optionsIcon}` })
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
