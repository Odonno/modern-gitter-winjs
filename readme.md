# modern-gitter-winjs [![Join the chat at https://gitter.im/Odonno/Modern-Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/Odonno/Modern-Gitter?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

A Gitter client application for Windows 10 based on WinJS and Angular frameworks.
This project is a second iteration, starting from the previous project : [Modern Gitter](https://github.com/Odonno/Modern-Gitter).

## Features

Modern Gitter contains a small set of features that directly target Gitter API. Here is the key features :

* Join a new or existing room
* Retrieve your current rooms
* Search among your current rooms
* Chat in realtime (see & send messages)
* Receive realtime notifications (in-app notifications)
* Receive delayed notifications (toasts notifications : unread items and mentions)

## Frameworks

This project makes use of several frameworks like : 

* [WinJS](https://github.com/winjs/winjs)
* [winstrap](https://github.com/winjs/winstrap)
* [angular](https://github.com/angular/angular)
* [angular-winjs](https://github.com/winjs/angular-winjs)
* [ui-router](https://github.com/angular-ui/ui-router)
* [faye](https://github.com/faye/faye)
* [gulp](https://github.com/gulpjs/gulp)

## Contribute

You can contribute to this project. There is several rules to follow :

* Use the angular git commit convention
* Create Pull Request with an understandable title and a short message that explains your contribution
* Be free to innovate !

### Getting started

In order to contribute, you should `clone` this repository and install some packages.

    npm install
    
Then, you will need to use gulp task automation tool. So, install it globally.

    npm install -g gulp

Finally, run `gulp` to execute task and compile angular app anytime you make a change.

    gulp

### Commit convention

We follow the angular git commit convention (https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#-git-commit-guidelines).
Here are some examples that can help you to visualise how to make meaningful commits.

When fixing a bug with the notifications

    fix(notifications): remove call that push twice the same notification

When adding a new feature related to notifications

    feat(notifications): add push notifications when someone mentions user

When fixing an issue with the build / improving the build system

    chore(app): improve build system

When adding some documentation

    docs(readme): add a contribute section

### List of contributors

I want to thank the following contributors who have helped me all along this project.

* @gep13
* @bobmulder
* @wassim-azirar
* @NPadrutt
* @corentinMiq
