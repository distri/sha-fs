window["distri/sha-fs:master"]({
  "source": {
    "LICENSE": {
      "path": "LICENSE",
      "content": "The MIT License (MIT)\n\nCopyright (c) 2014 \n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n\n",
      "mode": "100644",
      "type": "blob"
    },
    "README.md": {
      "path": "README.md",
      "content": "sha-fs\n======\n\nSimple content addressed storage for data\n",
      "mode": "100644",
      "type": "blob"
    },
    "main.coffee.md": {
      "path": "main.coffee.md",
      "content": "SHA FS\n======\n\nContet addressed filesystem.\n\n    module.exports =\n\nStore the given data returning a promise that is fulfilled by the content \naddress when the data has been persisted to the backing store.\n\n      store: (data) ->\n        \n\nReturn a promise that will be fulfilled with the data if it exits or rejected if\nnot found.\n\n      retrieve: (sha) ->\n\nWe want to be able to support multiple kinds of content addressed filesystem:\n\n- Volatile in memory store\n- LocalStorage backed store\n- S3 Backed Store\n",
      "mode": "100644"
    },
    "pixie.cson": {
      "path": "pixie.cson",
      "content": "",
      "mode": "100644"
    }
  },
  "distribution": {
    "main": {
      "path": "main",
      "content": "(function() {\n  module.exports = {\n    store: function(data) {},\n    retrieve: function(sha) {}\n  };\n\n}).call(this);\n",
      "type": "blob"
    },
    "pixie": {
      "path": "pixie",
      "content": "module.exports = undefined;",
      "type": "blob"
    }
  },
  "progenitor": {
    "url": "http://www.danielx.net/editor/"
  },
  "entryPoint": "main",
  "repository": {
    "branch": "master",
    "default_branch": "master",
    "full_name": "distri/sha-fs",
    "homepage": null,
    "description": "Simple content addressed storage for data",
    "html_url": "https://github.com/distri/sha-fs",
    "url": "https://api.github.com/repos/distri/sha-fs",
    "publishBranch": "gh-pages"
  },
  "dependencies": {}
});