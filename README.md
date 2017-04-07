# A simple key/value store based on node

`skvs` is a simple key/value store system which is simple to operate. Coded in
javascript and based on [express](http://expressjs.com/). It exposes a standard
REST api to store schema-less JSON data.

`skvs` can either store in volatile memory or on the filesystem for permanent storage.

It also provides a 'real-time' update notification facility based on long-polling.

# Install

To install globally, using npm:
```
~ npm install -g skvs
```

To just give it a try:
```
~ git clone https://github.com/jdmichaud/skvs && cd skvs
~ npm install
~ ./skvs.js
```

## Sample usage:

Once `skvs` is running:

```
~ # Create books
~ curl -sL -w'\n' -X POST -d '{ "author": "Arthur C. Clarke", "title": "Childhood\'s End" }' localhost:12000/api/book/ -H 'Content-type: application/json'
{"author":"Michael Crichton","title":"The Andromeda Strain","id":1}
~ curl -sL -w'\n' -X POST -d '{ "author": "Michael Crichton", "title": "The Andromeda Strain" }' localhost:12000/api/book/ -H 'Content-type: application/json'
{"author":"Arthur C. Clarke","title":"Rendez-Vous With Rama","id":2}
~ curl -sL -w'\n' -X POST -d '{ "author": "Arthur C. Clarke", "title": "Rendez-Vous With Rama" }' localhost:12000/api/book/ -H 'Content-type: application/json'
{"author":"Arthur C. Clarke","title":"The Fountain Of Paradise","id":3}
~ curl -sL -w'\n' -X POST -d '{ "author": "Joe Haldemann", "title": "The Forever War" }' localhost:12000/api/book/ -H 'Content-type: application/json'
{"author":"Joe Haldemann","title":"The Forever War","id":4}
~ # Retrieve the list of books
~ curl -sL -w'\n' localhost:12000/api/book/ -H 'Content-type: application/json'
[{"author":"Michael Crichton","title":"The Andromeda Strain","id":1},{"author":"Arthur C. Clarke","title":"Rendez-Vous With Rama","id":2},{"author":"Arthur C. Clarke","title":"The Fountain Of Paradise","id":3},{"author":"Joe Haldeman","title":"The Forever War","id":4}]
~ # Not the correct author? change a particular field of an existing book
~ curl -sGL -w'\n' localhost:12000/api/book/ --data-urlencode "author=Arthur C. Clarke"
[{"author":"Arthur C. Clarke","title":"Rendez-Vous With Rama","id":2},{"author":"Arthur C. Clarke","title":"The Fountain Of Paradise","id":3}]
~ # Typo in the author's name? replace an existing book
~ curl -sL -w'\n' -X POST -d '{ "author": "Joe Haldeman", "title": "The Forever Wa" }' localhost:12000/api/book/4/ -H 'Content-type: application/json'
{"author":"Joe Haldeman","title":"The Forever Wa","id":4}
```

## /Real-time/ update

To be notified of changes on a resource, `GET` the resource with the `?watch` option this way:

```
~ curl -sL -w'\n' localhost:12000/api/book?watch -H 'Content-type: application/json'
```

This will block until a change is performed on that resource. In another terminal, perform a change to the request:
```
~ curl -sL -w'\n' -X POST -d '{ "author": "Joe Haldeman", "title": "The Forever War" }' localhost:12000/api/book/4/ -H 'Content-type: application/json'
```

The first command will return with the updated value.

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

To launch `skvs` with the filesystem for storage
```
~ skvs --host 0.0.0.0 --port 12345 --storage=/tmp/data
server listening on port 0.0.0.0:12000 using filesystem store on /tmp/data
```

To launch `skvs` with a custom url prefix
```
~ skvs --prefix myapp
server listening on port 127.0.0.1:12000 using memory store
~ curl -sL -w'\n' localhost:12000/myapp/some-resource/
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
