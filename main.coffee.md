SHA FS
======

Contet addressed filesystem.

    module.exports =

Store the given data returning a promise that is fulfilled by the content 
address when the data has been persisted to the backing store.

      store: (data) ->
        

Return a promise that will be fulfilled with the data if it exits or rejected if
not found.

      retrieve: (sha) ->

We want to be able to support multiple kinds of content addressed filesystem:

- Volatile in memory store
- LocalStorage backed store
- S3 Backed Store
