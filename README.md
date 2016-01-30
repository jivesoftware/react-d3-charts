# react-d3-charts
A D3 charting library for React

* Currently supports line charts and bar charts (more are coming soon)
* ES6 support
* Grid lines
* Legends
* Enzyme Tests
* Demo app

##installation

```shell
$ npm install react-d3-charts
```

##usage

**The demo app is currently a work in progress**
```shell
$ npm run demo
$ open http://localhost:8080/webpack-dev-server/
```

There also tests that you should probably look at.
See test/BarChart-test or test/LineChart-test.

##code layout
The es6 source code is in the /src directory.
The published code is transpiled from /src to the /lib directory by running the build task (see below). The build task is automatically called when the module is published (see package.json -> scripts -> prepublish).
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
