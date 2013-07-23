# Socialite
## A social-network app

Here come Socialite. It implements classic features from facebook-like networks, including:
- Profile
- Pictures
- Friends
- Messenging system

It is mostly a prototype and has little out-of-the-box features. It is meant to be extended and tuned to fit one's need. This project is mostly for my own amusement, and because I wanted to play with the [Meteor](http://meteor.com) platform.

## How to run

1. `npm install -g meteorite` (if not already installed)
2. `mrt`

Should do it. It should download all dependencies then initialize the database.

You can tweak the fixture file to add/remove questions/fake users. Also copy the main.config.sample file to main.config.js and edit what you want.

 ## Cool stuff

The questions for users' profile are stored in the database, with different type, custom template and validation. When a user update its profile, its inputs are checked against the question database and their validation. This ensure an easy and somehow secure way to administrate and render what is generally consider (at least by me) as a horrible pain in the neck.

It's all in Meteor, so everything is pretty much instantaneous, which is cool.

There should be some i18n support, but a lot of placeholders are missing (and some string are hardcoded), and the lexicon is far from being complete. The logic is here though.

## TODO

There is a lot left to do and little time. Among the list:
- The setting page for user is pretty much non-existent
- There is a commenting system, but it is not plugged anywhere, so it is pretty useless
- With more questions we could have a cool Profile Editing page.
- Would be cool to be able to like/+1 users' content and action.
- Add more user interactions, it's a bit dry right at the moment.
- Some design. Current one is pretty minimalist. The UI in general is pretty much only what [Boostrap](https://github.com/twitter/bootstrap) offers.
- Security might not be horrible, but it is certainly not good. User input are validated but not sanitized at the moment.

## License stuff

This project is licensed with the MIT license.

## Contributors
- [Emmanuel Prochasson](https://github.com/eprochasson/)