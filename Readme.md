This is the [Emscripten](http://emscripten.org)-powered JavaScript port of
[Stockfish](http://stockfishchess.org) — powerful, GPL-licensed chess engine.

This file covers the difference between vanilla Stockfish and the port.
Original readme about engine itself has been renamed
as [Readme-original.md](Readme-original.md).

Live demo: https://rawgit.com/skalee/stockfish-emscripten/master/demo/index.html


Features and limitations
------------------------

1.  All the basic features required to run formidable chess AI have been ported
    successfully.

2.  However, openings books are not supported yet.  That means that engine
    evaluates initial moves instead of playing well-known openings.

3.  In addition to stdin/stdout interface, a simple JavaScript API has been
    added.  See [using section](#Using).

4.  UCI commands are processed sequentially.  Input is blocked until previous
    command completes.  For this reason, `stop` command won't work and
    `go infinite` cannot be interrupted.

5.  Time limits (like in `go movetime 2000`) don't work.  Use depth limits.

6.  Some engine options may not work correctly.  Tweaking them may give
    no change or unintended behavior.  I guess options not related to threading
    will work as expected, however the exact status needs investigation.

7.  `quit` command does not work.  Currently, there is no elegant way to unload
    Stockfish.

8.  Should work in all modern browsers including IE10+ and, of course, NodeJS.


Performance
-----------

Engine is visibly slower than C-based Stockfish.  Search from start position
with depth=10 takes few seconds on modern computer while original Stockfish
would return best move nearly instantly.  Also initialization takes several
seconds.

One of the possible reasons is that Stockfish [relies on 64-bit integers which
are not present in JavaScript and emulated](https://github.com/kripken/emscripten/wiki/CodeGuidelinesAndLimitations#code-that-does-compile-but-might-be-slower-than-expected).

Making this port compatible with `-O2` and `-O3` should make an improvement,
too.

However, current performance should be acceptable for many applications.  Simply
original Stockfish is blazing-fast and the port is "only" quite fast.  Also
keep in mind that you can run the engine entirely in the client browser which
eliminates scalability issues and network latency when compared to distributed
solutions.

Resulting script weighs about 4 MB when compiled with `-O1`.  It requires
a little more than 64MB RAM.


Compiling
---------

First of all, set up [Emscripten](https://github.com/kripken/emscripten/wiki).

Then make sure you have [Boost](http://www.boost.org) libraries installed.
[Only headers are required](http://www.boost.org/doc/libs/1_55_0/more/getting_started/unix-variants.html#header-only-),
so you don't need to recompile whole library in Emscripten-friendly manner.
(Actually, it's enough to grab Boost's source code and point to it.)
If Boost is installed but compiler still can't find those headers
(like it happened on my OS X with Boost installed via Homebrew), you may need to
set include path explicitly, for example:

    make CPLUS_INCLUDE_PATH=/usr/local/include

Ability to compile native binary with traditional C++ compiler is not a design
goal and not supported.  Vanilla Stockfish will perform way better in such case.

Compiling JavaScript on non Windows is not officially supported.  Actually,
I've stripped some Windows-related stuff from [src/platform.h](src/platform.h).
However if you really want to fix it, it shouldn't be hard.  Perhaps changes
would be limited to rewriting routines for managing threads and
condition variables as it has been done for *nix.  Also you have to find a way
to run Makefile on Windows or switch to another building tool.  The good news is
that both Boost and Stockfish are designed to work on Windows.

Stockfish won't work with the new Emscripten's compiler core:
[fastcomp](https://github.com/kripken/emscripten/wiki/LLVM-Backend).
It is disabled by `EMCC_FAST_COMPILER=0` in the Makefile.  During compilation,
a warning may appear:
`clang++: warning: argument unused during compilation: '-nostdinc++'`.
It's normal.

Compiling with `-O2` or bigger results with ugly crash on boot attempt for yet
unknown reason.


Using
-----

1.  As a standalone software:

    Simply run `stockfish` executable which is a trivial NodeJS script.
    It reads from standard input and writes to standard output, as defined
    in UCI.

    It uses [Readline module of NodeJS](http://nodejs.org/api/readline.html)
    which is marked as unstable,
    [that means](http://nodejs.org/api/documentation.html#documentation_stability_index):
    "The API is in the process of settling, but has not yet had sufficient
    real-world testing to be considered stable. Backwards-compatibility
    will be maintained if reasonable."

2.  By including in larger script:

    Stockfish will initialize automatically.  It takes some time and happens
    synchronously so it may be not a brightest idea to run it in browser outside
    web worker.  The `Module` global object contains, apart from less
    interesting things, two important attributes: the `uci(command)` function
    is an entry point.  Pass a `command` to it and Stockfish will react
    accordingly.  The `emit(response)` function handles UCI response which is
    a (possibly multiline) string passed as parameter.  Reassign this function
    to capture Stockfish responses.  The default placeholder function writes to
    browser console or standard output, whichever is available.

3.  By requiring in NodeJS:

    Generated JavaScript can be required as module.  Stockfish initializes
    automatically and synchronously which takes some time.  Both `uci`
    and `emit` (see previous point) are exported.  You may take a look
    at `stockfish` script which actually does it.

Documentation of UCI protocol (and some example session)
is [here](http://wbec-ridderkerk.nl/html/UCIProtocol.html).  You'll surely want
to read it.

If you prefer bunch of meaningful functions over strings-based interface,
then you should check [Imor's UCI wrapper](https://github.com/imor/uci) which
requires some modifications as it currently works with stdin/stdout only,
but it shouldn't be a big burden.


Contributing
------------

Stockfish-emscripten is defined as a sequence of patches for vanilla
Stockfish.  Those patches are maintained as git commits applied on top of
given Stockfish version.  Upgrading the engine will require rebasing all those
commits on top of another version.

As a consequence:

1.  Expect occasional forced pushes with history rewrites on the master branch.
    While it sounds unnatural to many Git users, I actually expect it to be
    simpler and more managable than regular merges.  Also, new maintenance
    branch or tag would be created in such case.

2.  Touching as little lines of original sources as possible is a priority.
    It is much more important than, for example, maintaining consistent
    indentation.  Be cautious when using style-fixing tools.

3.  The rest as usual — [fork, create topic branch, commit, push and open
    a pull request](https://help.github.com/articles/using-pull-requests).

I am open for suggestions how to improve this flow.


Terms of use
------------

*These paragraphs come entirely from original Readme.*

Stockfish is free, and distributed under the **GNU General Public License**
(GPL).  Essentially, this means that you are free to do almost exactly
what you want with the program, including distributing it among your
friends, making it available for download from your web site, selling
it (either by itself or as part of some bigger software package), or
using it as the starting point for a software project of your own.

The only real limitation is that whenever you distribute Stockfish in
some way, you must always include the full source code, or a pointer
to where the source code can be found. If you make any changes to the
source code, these changes must also be made available under the GPL.

For full details, read the copy of the GPL found in the file named
[Copying.txt](Copying.txt).
