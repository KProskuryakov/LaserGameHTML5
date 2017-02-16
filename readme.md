Install Webstorm and node.js (npm is the important part of it).

```console
npm init -y
npm install --save-dev babel-cli
```

Then go to settings -> tools -> file watchers and enable babel. Should be pointing at the babel.cmd file in .bin in 
node_modules

```console
npm install --save-dev babel-preset-es2015
```

Then set up a .babelrc file with:

```
{
  "presets": ["es2015"]
}
```

Okay so well, babel is not really needed. Seems like chrome just has support for es6 and... if you don't have chrome 
then I don't want you playing this thing.

I learned about some cool things like `window.requestAnimationFrame(callback)`

```js
function update (curTime, oldTime, ctx, windowWidth, windowHeight, tileSize) {
     const dt = (curTime - oldTime) / 1000;
     //console.log(dt);
     draw(ctx, windowWidth, windowHeight, tileSize, dt);
     window.requestAnimationFrame((newTime) => {update(newTime, curTime, ctx, windowWidth, windowHeight, tileSize)});
 }
```

This code snippet also takes care of dt values (similar to the `love.update(dt)`
function in love2d). I'm actually sure that there's a less drawing heavy way of doing this too.

