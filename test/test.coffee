SHAFS = require "../main"

describe "FS", ->
  it "Should store and retrieve", (done) ->
    fs = SHAFS()

    fs.store("hello").then (sha) ->
      fs.retrieve(sha).then (data) ->
        assert.equal data, "hello"
        done()

  it "should not find data that is not present", (done) ->
    fs = SHAFS()
    
    fs.retrieve("doot").catch (message) ->
      done()
