# dosya [![Build Status](https://travis-ci.org/PySualk/dosya.svg?branch=master)](https://travis-ci.org/PySualk/dosya)

Everybody has these messy directories on their computers with hunderds or thousand of files where you only put stuff in it without touching it again. For example my Download directories always are a huge mess :smiley: 

This is a simple Node.js based command line tool that should help to automatically organize files and directories by implementing different strategies. Take a look at the examples to see what you can use dosya for.

## Help wanted!

I started this project to learn a little TypeScript and to try out some new technologies and libraries. Also I am lookig for people to join. If you are interested drop me a message.


## Install

Right now the only way running dosya is by cloning this project. In the future the project will hopefully also be available via the npm registry. 
```sh
> git clone https://github.com/PySualk/dosya.git
> cd dosya/
> yarn
> yarn build && yarn start
```

## Usage

```sh
> dosya --help

 Usage: dosya [options] <directory>

  Options:

    -V, --version                output the version number
    -d, --debug                  output additional debug information
    -n, --dry-run                Run the program without changing any files (combine with -d to show all changes that would be performed)
    -s, --strategy [strategy]    Use one of the following ordering stategies: nop, byCreationDate
    -e, --exclude [directories]  Exclude the given directories (separated by ',')
    -h, --help                   output usage information
```

### Examples

```sh
# Organize the directory /home/user/Pictures by using the "byCreationDate" strategy and exclude the "christmas/" folder
dosya -s byCreationDate -e "christmas/" -n /home/user/Pictures
```

### Options

##### `-d`, `--debug`

Display additional information while organizing your files. If you add `-d` you are going to see every single file that is going to be moved.

##### `-n`, `--dry-run`

Run the program but do not move any files. This can be used if you are not sure what a set of parameters are doing.

##### `-s`, `--strategy`

You can choose between the (yet not so many) following strategies: byCreationDate, byMappingFile

The strategies itself are explained [here](#strategies).

##### `-e`, `--exclude`

Exclude a given list of directories or files (using `,` as separator between elements). 

##### `-h`, `--help`

Display the usage information

### <a name="strategies"></a>Strategies

There are just two strategies so far but the project contains a simple API to implement new strategies.

#### byCreationDate

Moves all files depending on the creation date into a subfolder containing the year and the month.

Before:
```
.
├── file1
├── file2
└── file3
```
After:
```
.
├── 2016
│   └── 12
│       └── file3
└── 2018
    ├── 01
    │   └── file2
    └── 03
        └── file1
```

#### byMappingFile

Here you can provide a `mapping.json` file that contains moves files based on a regular expression into a given directory. A mapping file have to be in the follwing format:
```json
[
    {
        "regex": "<enter a regex here>",
        "destination": "<enter a destination folder>"
    }
]
```

If a filename matches a regular expression it is going to be moved to the directory that is given as destination. You can add a list of these regex/destination objects to the mapping file. The first rule that applies is going to be used to move the file. If no rule applies a file won't be moved at all.

For example this strategy may be used for moving files by extensions:
```json
[
    {
        "regex": ".(gif|jpg|jpeg|tiff|png)$",
        "destination": "images/"
    },
    {
        "regex": ".(mp3|wav|flac)$",
        "destination": "music/"
    }
]
```

### License

MIT © [PySualk](https://github.com/PySualk)
