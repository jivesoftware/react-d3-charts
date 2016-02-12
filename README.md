# react-d3-charts
A D3 charting library for React

* Line charts, Bar charts, and Area Chart (more are coming soon)
* ES6 support
* Grid lines
* Legends
* Tooltips
* Tests!
* Demo app

##installation

```shell
$ npm install react-d3-charts
```

##usage

Check out the demo
```shell
$ npm run demo
$ open http://localhost:8080/webpack-dev-server/
```

There also tests that you should probably look at.

###tl;dr
```
React.render(
  <div>

    <BarChart
      data=[
        {
          label: 'Fruits',
          values: [{x: 'Apple', y: 10}, {x: 'Peaches', y: 4}, {x: 'Pumpkin Pie', y: 3 }]
        }
      ]
    />

    <LineChart
      data=[
        {
          label: 'Apple',
          values: [{x: 0, y: 2}, {x: 1.3, y: 5}, {x: 3, y: 6}, {x: 3.5, y: 6.5}]
        },
        {
          label: 'Peaches',
          values: [{x: 0, y: 3}, {x: 1.3, y: 4}, {x: 3, y: 7}, {x: 3.5, y: 8}]
        }
      ]
    />

    <AreaChart
      data=[
        {
          label: 'Snowmen',
          values: [{x: 0, y: 5}, {x: 1.3, y: 6}, {x: 3, y: 7}, {x: 3.5, y: 8}]
        }
      ]
    />

  </div>,
  document.getElementById('container')
)
```



##code layout
The es6 source code is in the /src directory.

The published code is transpiled from /src to the /lib directory by running the build task (see below).

The build task is automatically called when the module is published (see package.json -> scripts -> prepublish).

The root index.js imports code from the /lib directory allowing end-users to seamlessly use the module without requiring babel or some other transpiler.

##tasks

run the tests
```shell
$ npm test
```

generate test coverage report
```shell
$ npm test --coverage
```

build the module for distribution
```shell
$ npm run build
```

##resources
* This started out initially as a fork of [react-d3-components](https://github.com/codesuki/react-d3-components)
* Color sorting provided by [sc-color](https://www.npmjs.com/package/sc-color)
