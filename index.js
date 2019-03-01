"use strict";

const { remote } = require("electron");

function loadTitlebarOptions({ titlebar = {} }) {
  return {
    iconRadius: titlebar.iconRadius || "50%",
    iconSize: titlebar.iconSize || "16px",
    height: titlebar.height || "26px",
    headerBg: titlebar.headerBg || "#2f343f",
    closeBg: titlebar.closeBg || "#f25056",
    minimizeBg: titlebar.minimizeBg || "#fac536",
    maximizeBg: titlebar.maximizeBg || "#39ea49",
    burgerBg: titlebar.burgerBg || "white",
    borderColor: titlebar.borderColor || "#000"
  };
}

exports.decorateConfig = config => {
  if (config.showWindowControls == false) return config;
  let isLeft = config.showWindowsControls === "left";
  let opts = loadTitlebarOptions(config);

  return Object.assign({}, config, {
    css: `
      ${config.css || ""}
      .terms_terms {
        margin-top: -webkit-calc(${opts.iconSize} + 15px);
      }
      .header_windowHeader {
        visibility: hidden;
      }
      .header {
        background-color: #303030;
        -webkit-app-region: drag;
      }
      .actions > * {
        -webkit-app-region: no-drag;
      }
      .actions {
        display: -webkit-inline-flex;
      }
      .actions span {
        width: ${opts.iconSize};
        height: ${opts.iconSize};
        border-radius: ${opts.iconRadius};
        margin: 5px;
        margin-bottom: 7px;
      }
      .close {
        background-color: ${opts.closeBg};
      }
      .minimize {
        background-color: ${opts.minimizeBg};
      }
      .maximize {
        background-color: ${opts.maximizeBg};
      }
      .burgerMenu {
        background-color: white;
        position: absolute;
        right: 0px;
      }
      .header_hamburgerMenuLeft {
        right : 0px;
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
      this.burgerMenu = this.burgerMenu.bind(this);
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

    burgerMenu() {
      this.props.openHamburgerMenu({ x: 0, y: 32 });
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
          React.createElement("span", { className: "maximize", onClick: this.maximizeApp }),
          React.createElement("span", { className: "burgerMenu", onClick: this.burgerMenu })
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
