# hyper-titlebar

Note: Prerelease, Version: 0.0.1

## Usage

Add following line to `.hyper.js`:

```js
plugins: [
  'hyper-titlebar'
],
```

## Configuration Reference

For customization of the `hyper-titlebar` plugin, add your lines to `.hyper.js`:

```js
config: {
  titlebar: {
    buttonSize: '42px',
    buttonRadius: '42%',
    closeButtonBg: '#FD6261',
    minimizeButtonBg: '#FEBA59',
    maximizeButtonBg: '#1CC65B',
    optionsButtonBg: '#aaaaaa'
  }
  plugins. [
    'hyper-titlebar'
  ]
  
```

The reference below, show the default configuration.

### Titlebar

```js
titlebar: {
  color: '#303030',
  height: '34px',
  radius: false,
}
```

### Buttons

```js
titlebar: {
  /* General */
  buttonSize: '20px',
  buttonRadius: '50%',
  /* Individual */
  closeButtonBg: '#f25056',
  minimizeButtonBg: '#fac536',
  maximizeButtonBg: '#39ea49',
  optionsButtonBg: '#ffffff',
}
```

### Icons

```js
titlebar: {
  /* General */
  iconSize: '60%',
  /* Icons */
  closeIcon: 'fas fa-times',
  minimizeIcon: 'fas fa-minus',
  maximizeIcon: 'fas fa-plus',
  optionsIcon: 'fas fa-bars',
  /* Icon Colors */
  closeIconCol: '#2f343f',
  minimizeIconCol: '#2f343f',
  maximizeIconCol: '#2f343f',
  optionsIconCol: '#2f343f',
  /* Rotation Effect */
  rotateSpeed: '0.25s',
  /* Glare Effect */
  glare: false,
  glareScale: 0.25
}
```

## TODO

* burger menu positioning
* glare effect