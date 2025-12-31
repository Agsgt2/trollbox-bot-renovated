# Trollbox-bot-renovated

Trollbox-bot-renovated is a remade library.<br>
Check out the [original library](https://github.com/codingMASTER398/trollbox-bot)!

## Installation

There is currently no library for this project

## Usage

First of all, require the module into your project.
```js
const tb = require("trollbox-bot")
```
If you are using a `.mjs` file. Use this instead.
```js
import tb from "trollbox-bot"
```

To connect your bot, add the following code and change the parameters.
```js
tb.connect("Name", "Color", "Prefix", "Welcome message")
```
`onconnect` - the commands inside the function will be ran when the bot connects
```js
tb.onconnect = function(socket) {
  socket.send("nah i'm out of here.")
  socket.disconnect()
}
```
`setcommand` - makes the bot react when `perfix + command == data.msg` is true.
```js
tb.setcommand("ping",function(data, socket) {
  socket.send("Pong!")
})
```
the `data` value contains the following:
```json
{
  date: 1618120112288, // The date where the message has been sent.
  nick: 'joe',         // Name of the message in trollbox
  color: '#f78b00',    // Color of the user
  style: '',           // idk...
  home: 'Njg1MDg',     // The home of the user
  msg: '=a'            // The message of the user
}
```

`onmessage` - Fires a function when a message is sent, complex but useful in some cases.
```js
bt.onmessage(function(data) {
  console.log(data.nick+": "+data.msg)
})
```

`onuserjoined` - Fire a function when a user joins
```js
tb.onuserjoined(function(data) {
  console.log(data)
})
```

`onuserleft` - Fire a function when a user leaves
```js
tb.onuserleft(function(data) {
  console.log(data)
})
```
`updatecolor` - Updates the color of the bot
```js
tb.updatecolor("White")
```

`updatename` - Updates the name of the bot
```js
tb.updatename("Joebot (=)")
```

### New in v1
Now, you don't have to use `tb.setAddress()` anymore!

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## His bot
Yeah remember BONZI? well he's gone, sorry for his owner

## Bots made with this
None so far that has been noted

If you want your bot in this README, contact me at
lachienoble10@outlook.com.

## License
[MIT](https://choosealicense.com/licenses/mit/)
