SHA FS
======

    Q = require "q"
    SHA1 = require "sha1"

Content addressed filesystem.

Memory Store
------------

    ObjectStore = (storage) ->
      store: (data) ->
        deferred = Q.defer()

        SHA1 data, (sha) ->
          storage[sha] ?= data

          deferred.resolve(sha)

        deferred.promise

      retrieve: (sha) ->
        if (data = storage[sha])?
          Q(data)
        else
          Q.reject("#{sha} not found")

    MemoryStore = ->
      ObjectStore({})

    LocalStorageBackedStore = ->
      ObjectStore(localStorage)

    S3BackedStore = ->

    module.exports = LocalStorageBackedStore

    Interface =

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
