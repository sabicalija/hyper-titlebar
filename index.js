"use strict";

const { remote } = require("electron");
const FontAwesome = require("react-fontawesome");

function loadTitlebarOptions({ titlebar = {} }) {
  return {
    iconRadius: titlebar.iconRadius || "50%",
    iconSize: titlebar.iconSize || "16px",
    height: titlebar.height || "26px",
    headerBg: titlebar.headerBg || "#2f343f",
    closeBg: titlebar.closeBg || "#f25056",
    minimizeBg: titlebar.minimizeBg || "#fac536",
    maximizeBg: titlebar.maximizeBg || "#39ea49",
    optionsBg: titlebar.optionsBg || "white",
    borderColor: titlebar.borderColor || "#303030",
    borderHeight: `${parseInt(titlebar.iconSize) + 14}px`,
    borderRadius: titlebar.borderRadius || false
  };
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
        border-bottom-left-radius: ${parseInt(opts.iconSize) / 2}px;
        border-bottom-right-radius: ${parseInt(opts.iconSize) / 2}px;
        `
            : ""
        }

      }
      .actions {
        display: -webkit-flex;
      }
      .actions div {
        -webkit-app-region: no-drag;
        width: ${opts.iconSize};
        height: ${opts.iconSize};
        border-radius: ${opts.iconRadius};
        margin-top: 5px;
        margin-bottom: 7px;
      }
      .close {
        background-color: ${opts.closeBg};
        order: ${isLeft ? "1" : "4"};
        margin-right: ${isLeft ? "5px" : "5px"};
        margin-left: ${isLeft ? "5px" : "5px"};
      }
      .minimize {
        background-color: ${opts.minimizeBg};
        order: ${isLeft ? "2" : "3"};
        margin-right: ${isLeft ? "5px" : "5px"};
        margin-left: ${isLeft ? "5px" : "5px"};
      }
      .maximize {
        background-color: ${opts.maximizeBg};
        order: ${isLeft ? "3" : "2"};
        margin-right: ${isLeft ? "5px" : "5px"};
        margin-left: ${isLeft ? "5px" : "auto"};
      }
      .optionsMenu {
        background-color: ${opts.optionsBg};
        order: ${isLeft ? "4" : "1"};
        margin-right: ${isLeft ? "5px" : "5px"};
        margin-left: ${isLeft ? "auto" : "5px"};
      }
      .super-crazy-colors {
        width: 20px;
        height: 20px;
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
      const titlebar = React.createElement(
        "div",
        { className: "header" },
        React.createElement(
          "div",
          { className: "actions" },
          React.createElement(
            "div",
            { className: "close", onClick: this.closeApp },
            React.createElement(FontAwesome, {
              className: "super-crazy-colors",
              name: "rocket",
              size: "2x",
              style: {
                textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)",
                display: "block",
                width: "42px",
                height: "42px"
              }
            })
          ),
          React.createElement("div", { className: "minimize", onClick: this.minimizeApp }),
          React.createElement("div", { className: "maximize", onClick: this.maximizeApp }),
          React.createElement("div", { className: "optionsMenu", onClick: this.optionsMenu })
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
