# Rockford

Rockford is a tool that calculates DbC code coverage for clients using `simple-assert`. It is a _very_ basic tool. 
It assumes that you are going to play nicely with it, and not try to trick or confuse it. The central algorithm
counts functions and instances of `pre` and `post` `callees` inside those functions. Once it has these counts
it will compare, at file and file collection levels, the number of `pre` and `post` callees with the number of 
functions. It doesn't check to see whether or not you've doubled up pre or post conditions, or any other jankiness.
It assumes you will be a good citizen.

At the proverbial `some point`, Rockford may be improved to be a bit more persnicketty, particular, and specific.

* Rockford uses [Esprima](https://github.com/jquery/esprima) for JavaScript parsing.
* Rockford uses [Estraverse](https://github.com/estools/estraverse) to navigate the AST returned by _Esprima_.

### Installation, Configuration, and Usage

```
$ npm install rockford -D
```

You should then setup a `.rockford-file` config in the root of your application. The config takes two params:

```js
{
 "glob": "test/*.js", // A glob, or array of globs of files to analyze
 "sanityLevel": 0.8 // A decimal representing what determines a sane level of coverage
}
```

After that, the easiest way to run Rockford is as a script from your `package.json`:

```js
"scripts": {
  "coverage": "rockford"
}
```

## Filing Issues

Before filing an issue, please be sure to read the existing list of issues, to avoid submitting duplicates.

## License

MIT