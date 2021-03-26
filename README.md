# HTTPrototype Implementation

## Documentation
(This section is under construction).
### Call Scheme
The general calling scheme for this is to have an object and then call the function with it.  
**Example:**
```js
const options = {
   hostname: "https://api.github.com",
   path: "/",
   method: "GET",
   headers: {
   	"User-Agent": "HTTPrototype-Implementation/1.0.0"
   }
}

options.request().then(r => { /*......*/ })
```

## Contributing
[Read about contributing here](https://github.com/Forgi4G/HTTPrototype-Implementation/blob/main/CONTRIBUTING.md).

## License
[MIT](https://github.com/Forgi4G/HTTPrototype-Implementation/blob/main/LICENSE.md)