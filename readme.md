# umds [![Build Status](https://travis-ci.org/mastilver/umds.svg?branch=master)](https://travis-ci.org/mastilver/umds) [![Greenkeeper badge](https://badges.greenkeeper.io/mastilver/umds.svg)](https://greenkeeper.io/)

> Umdify node modules


## Usage

### ES modules

```html
<!DOCTYPE html>
<html>
<head>
  <title>My app</title>
</head>
<body>
  <script type="module">
    import objectAssign from 'https://unpkg.com/@umds/object-assign';

    console.log(objectAssign({one: 1}, {two: 2}));
  </script>
</body>
</html>
```

### RequireJs / AMD

```html
<!DOCTYPE html>
<html>
<head>
  <title>My app</title>
</head>
<body>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.1.14/require.js"></script>
  <script type="text/javascript" src="https://unpkg.com/@umds/object-assign"></script>
  <script>
    requirejs(['object-assign'], (objectAssign) => {
      console.log(objectAssign({one: 1}, {two: 2}));
    });
  </script>
</body>
</html>
```

### Global

```html
<!DOCTYPE html>
<html>
<head>
  <title>My app</title>
</head>
<body>
  <script type="text/javascript" src="https://unpkg.com/@umds/object-assign"></script>
  <script>
    console.log(window['object-assign']({one: 1}, {two: 2}));
  </script>
</body>
</html>
```


## Contributing

You can umdify any modules by editing: `umds.json`

## License

MIT © [Thomas Sileghem](http://mastilver.com)
