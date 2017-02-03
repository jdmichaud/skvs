# A simple key/value store based on node

`skvs` is a simple key/value store system which is simple to operate. Coded in
javascript and based on [express](http://expressjs.com/). It exposes a standard
REST api to store schema-less JSON data.

`skvs` can either store in volatile memory or on the filesystem for permanent storage.

## Sample usage:

```
~ curl -sL -w'\n' -X POST -d '{ "author": "Arthur C. Clarke", "title": "Childhood\'s End" }' localhost:12000/api/book/ -H 'Content-type: application/json'
{"author":"Michael Crichton","title":"The Andromeda Strain","id":1}
~ curl -sL -w'\n' -X POST -d '{ "author": "Michael Crichton", "title": "The Andromeda Strain" }' localhost:12000/api/book/ -H 'Content-type: application/json'
{"author":"Arthur C. Clarke","title":"Rendez-Vous With Rama","id":2}
~ curl -sL -w'\n' -X POST -d '{ "author": "Arthur C. Clarke", "title": "Rendez-Vous With Rama" }' localhost:12000/api/book/ -H 'Content-type: application/json'
{"author":"Arthur C. Clarke","title":"The Fountain Of Paradise","id":3}
~ curl -sL -w'\n' -X POST -d '{ "author": "Joe Haldemann", "title": "The Forever War" }' localhost:12000/api/book/ -H 'Content-type: application/json'
{"author":"Joe Haldemann","title":"The Forever War","id":4}
~ curl -sL -w'\n' localhost:12000/api/book/ -H 'Content-type: application/json'
[{"author":"Michael Crichton","title":"The Andromeda Strain","id":1},{"author":"Arthur C. Clarke","title":"Rendez-Vous With Rama","id":2},{"author":"Arthur C. Clarke","title":"The Fountain Of Paradise","id":3},{"author":"Joe Haldeman","title":"The Forever War","id":4}]
~ curl -sGL -w'\n' localhost:12000/api/book/ --data-urlencode "author=Arthur C. Clarke"
[{"author":"Arthur C. Clarke","title":"Rendez-Vous With Rama","id":2},{"author":"Arthur C. Clarke","title":"The Fountain Of Paradise","id":3}]
~ curl -sL -w'\n' -X POST -d '{ "author": "Joe Haldeman", "title": "The Forever War" }' localhost:12000/api/book/4/ -H 'Content-type: application/json'
{"author":"Joe Haldeman","title":"The Forever War","id":4}
```

# Install

To install globally, using npm:
```
npm install -g skvs
```

# Usage

To launch with all the default value:
```
~ skvs
server listening on port 127.0.0.1:12000 using memory store
```
By default, `skvs` will only accept local connections and will use the memory as storage.

To launch on a specific host and port
```
~ skvs --host 0.0.0.0 --port 12345
server listening on port 0.0.0.0:12000 using memory store
```

To launch with the filesystem for storage
```
~ skvs --host 0.0.0.0 --port 12345 --storage=/tmp/data
server listening on port 0.0.0.0:12000 using filesystem store on /tmp/data
```

# Development

To participate in `skvs` development, clone the repository:
```
git clone https://github.com/jdmichaud/skvs
```

And submit a pull request.

All development shall be covered by unit tests.
To run the test:
```
~ npm test
```