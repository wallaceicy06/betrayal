Betrayal
========
A web game spinoff of
[Betrayal of the House on the Hill](http://boardgamegeek.com/boardgame/10547/betrayal-house-hill).

developed by Valerie Baretsky, Sean Harger, and Lauren Staal at
[Rice University](http://www.rice.edu).

Game Creation
-------------
To create a new game, click **Create Game** and enter the name of your player
and the game of the new game.

To join a game, click **Join Existing Game**, enter your name, select an
existing game from the drop down list, and click **Join**.

Game Controls
-------------
Move using the **W**, **A**, **S**, **D** or arrow keys.

Use the **space bar** to attack another player.

Press **F** to interact with items in rooms.

After the haunt begins (if you are the traitor), use **E** to toggle your
traitor ability.

For more detailed instructions, see the "How to play" section by clicking the
aptly named button in the GUI.

Installation
------------
This game depends on the NodeJS framework. Make sure you have `node` and `npm`
installed.

in the "Betrayal" top-level directory. You will need to install `sails`
globally instead of simply in the local project directory. To do this, execute
before running the above command.

    npm install -g sails

To install the other dependencies for this project, run

    npm install

To compile the SASS templates for this project, you will need `ruby` and the
`sass` gem to be in your PATH. Once you install `ruby`, you can install `sass`
by executing

    gem install sass

Running
-------
To run the web server, execute

    sails lift

from the command line. By default in the development environment, the database
contents will be dropped each time that you run this command.

The application will run on your local machine on port 1337 by default. This
can be accessed in a web browser by navigating to

    http://[youripaddress]:1337

Credits
-------

We graciously appreciate [Glyphicons'](http://glyphicons.com/) generous donation
of their icons to the Bootstrap library. Some of these were used in the project.
