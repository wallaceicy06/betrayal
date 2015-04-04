Betrayal
========
a web game spinoff of "Betrayal of the House on the Hill"

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

Press **Q** to toggle the map view.

After the haunt begins (if you are the traitor), use **E** to toggle your
traitor ability.

Installation
------------
This game depends on the NodeJS framework. Make sure you have `node` and `npm`
installed.

To install dependencies for this project, run

    npm install

in the "Betrayal" top-level directory. It is recommended (but not required)
that you install `sails` globally instead of simply in the local project
directory. To do this, execute before running the above command.

    npm install -g sails

Running
-------
To run the web server, execute

    sails lift

from the command line. By default in the development environment, the database
contents will be dropped each time that you run this command.

The application will run on your local machine on port 1337 by default. This
can be accessed in a web browser by navigating to

    http://[youripaddress]:1337
