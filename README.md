# Socialite

Hello there! This repo hasn't been updated in quite some time, if you're looking for example of up-to-date social apps with Meteor, check out this [great tutorial with Meteor/Angular](http://angular-meteor.com/tutorial/) 

## A simple facebook-like app made with Meteor

Here comes Socialite. It implements classic features from facebook-like social networks, including:
- Profile
- Pictures
- Friends
- Messaging system

It is mostly a prototype. This project is for my own amusement, and because I wanted to play with the [Meteor](http://meteor.com) platform.

## How to run

1. `npm install -g meteorite` (if not already installed)
2. `mrt`

Should do it. It should download all dependencies then initialize the database.

You can tweak the `fixtures.js` file to add/remove questions/fake users (default fake users all reside in Hong Kong). Also copy the main.config.sample file to main.config.js and edit what you want.

## Cool stuff

The questions for users' profiles are stored in the database, with different custom template and validations. When a user update its profile, its inputs are checked against the question database and their validations. This ensure an easy and somehow secure way to administrate and render what is generally consider (at least by me) as a horrible pain in the neck.

It's all in Meteor, so everything is pretty much instantaneous, which is cool.

There should be some i18n support, but a lot of placeholders are missing (and some string are hardcoded), plus the lexicon is far from being complete. The logic is here though, and should allow for on-the-fly change of language, assuming more than one language should be made available.

## TODO

There is a lot left to do and little time. Among the list:
- The setting page for user is pretty much non-existent.
- There is a commenting system, but it is not plugged anywhere.
- With more questions we could have a cool Profile Editing page.
- Would be cool to be able to like/+1 users' content and action.
- Add more user interactions, it's a bit dry right at the moment.
- Some design. Current one is pretty minimalist. The UI in general is pretty much only what [Boostrap](https://github.com/twitter/bootstrap) offers.
- Security might not be horrible, but it is certainly not good. User input are validated but not sanitized at the moment.
- I would love to write unit test for it, be it only to stabilize the API, but TDD with Meteor doesn't seem to be mature enough at the moment and I only found trivial case of testing.

## API

API is a big word, but here are a few of the useful publications/collections/helpers/methods implemented in Socialite.

### Publications

#### myData

The current user data: full profile, settings and if the profile is completed (to be able to display the profile creation flow otherwise).

On-ready, sets the `settings` and `profileComplete` Session variable. to indicate that 1. the profile is loaded and 2. allow for easy access of those information.

#### myPictures

All the current user Photos.

#### myNotification

Notification for the current user, with potential related users (from Meteor.users -- if the notification is "friend request from A", we also publish a light version of A's information, to display along the notification.

#### myFriendlist

All my friends (from Friends) and the related users information (from Meteor.users).

#### myNews

Information happening to me and my interactions with other users (from Activities and Meteor.users).

#### myConversations

The list of my current conversations with people, friend or not (from Conversations) and their info (from Meteor.users).

#### questions

The list of questions (from Questions).

#### oneConversation

Depends on the Session variable `currentConversation`. Get some of the messages (from Messages) for a given conversation.

#### userProfile

Depends on the Session variable `currentUserProfile` (set when visiting a user profile). Publish user information from Meteor.users. What is published can be configured in `Meteor.users.privateProfileInformation` and `Meteor.users.myProfileInformation` (config file).

#### oneUserPicture

Publish pictures (from Photos) for the user set in `currentUserProfile`.

#### oneUserActivities

Publish activities for a given user (from `currentUserProfile`).

#### searchResults

Publish a list of users (from Meteor.users) matching the search query in Session variable `searchQuery`. On-ready, set the `searchQueryDone` Session variable, to trigger client side update of the template.

Publish related Presences objects to know the online status of users in the search results.

Search is done according to the client criteria and the client current location. Result only includes user near the client location.

### Collections

#### Meteor.users

The default Meteor.users collection, with not much change. The profile information are stored in the `profile` field of a user document. Additional used fields are:
- `loc`: stores the Mongo 2d geographical coordinates of a user, if available
- `visible`: indicates that the user can be seen/browsed by other users.
- `profile_complete`: indicates that the user finished the registration process and provide enough information to be left roaming freely on the website.
- `cooldown`: potential cooldown penalty for user posting messages too fast (for spam prevention).

#### Activities

Register the things happening to the users. Some are public (this can be tuned in the config file), some are for logging purpose only. The public activities are used to generate a user newsfeed.

Activities are meant to be updates on the server side through different user action on the site.

#### Comments

Meant to attach comment to different objects (Photos, ...). Implemented by not plugged to anything at the moment.

#### Conversations

Register who's talking to who, useful to list all the conversation for a given user (the mailbox). Denormalize the last message of the conversation, the last time something happened and if the current conversation has been read or not.

A conversation belong to one user and indicates the other participant. Hence, a conversation with A and B has two documents, one for A to B, and one for B to A. This allow for easy retrieving of one user's live conversations.

#### Messages

Register messages users send to each other. Each message is associated to both A to B and B to A conversation.

#### Friends

Register the asymetric relation between users. If A and B are friends, we record a relation from A to B and B to A. If A or B breaks the relationship, both relation are destroyed. If A sends a friend request to B, only the A to B relation is created. If B confirms, the relation B to A is added, and both relations are marked as "reciprocal". Only reciprocal relations are published.
Also denormalize the online status of users to their friends. When A is connected, it broadcast its online status to all its friend in the associated Friends document.

#### Notifications

Stuff that are to be shown in the navbar. Notifications include things like friend request, friend request confirmation. And that's basically it for now.

#### Photos

Pictures user can upload. The Photos collection is based on filepicker. A previous version (Pictures) used CollectionFS to store the picture locally. Store the url of a picture and the owner.

#### Presences

Record user presence, last time they were seen, if they are online and the time they spent on the site.

#### Questions

Stores the questions to be retrieve to create the form for the users. Questions define their template (how to render them), their type, their name (to associate the question and the field in a user profile) their validation (typically, what kind of options are available in a dropdown) and can easily be extended (check servers/helpers/forms.js).

Questions can be presented to a user using the general helper `make_question(name)`, name being the unique name of a question. When user submit a form containing a question, the validation associated with it is used.

### Methods

#### update_profile(values)

Updates the current user profile. It can only apply to the profile of the user calling it. `values` contains an Object where the keys are a Question id. This guarantee that a user can only add/update information of his profile from a predefined Question in the database. This method also validate the value according to the validation embedded with the Question.

A few values have special processing:
- the `location` field is used to create a mongo 2d index value (for proximity-based search)
- the `dob` (date of birth) field is copied in the `dobtime` field as a Unix timestamp for easier manipulation later on.

#### denormalizeProfilePicture(picture)

Set `profile.picture` to point to the url  of the Photos document whose _id is `picture`. Basically tell that this picture is the user's current profile picture.

#### profile_completed()

Check that a user profile is complete. This can be tuned in the `main.config.js` file, variable `Meteor.profileCreation.requiredFieldForCompletion`. Check that all the fields are defined. If yes, sets the `profile_complete`  and `visible` field of the current user to 1. The user is now visible to other user and can be searched for by other users.

#### sendComment

Unused.

#### validateInput(value, docid, validations)

Allow for client side validation of form input, using the Questions validation.

#### addAsFriend(target)

Attempt to connect the current user with user who's _id is `target`. If A and B have no relation, a friend request is sent to B, if B already asked for A's friendship, the relationship is confirmed and symetrical.

Also check if the requesting user is not in the target user's blacklist. Update Notifications and Activities.

#### removeFriend(target)

Remove a friendship between two users, both ways (A to B AND B to A). Just make the relationship not live and not reciprocal anymore.

#### sendMessage(document)

Send the message `document.body` to user whose `_id` is `document.to`. A couple thing happens there. We first check that the sender is allowed to communicate with the target, and also compute a velocity score, to prevent people from sending message too fast (aiming at preventing automatic spamming).

The velocity/cooldown algorithm is quite trivial. Users are allowed to send X message per period of Y seconds (can be tuned in the `main.config.js` file). If they send faster than that, they get a penalty of Z seconds (again, can be configured). If they try again, they add Z second to the current penalty. An automatic spammer not throttling down its sending rate will then automatically blocked itself for hours or days.

#### uploadPhoto(options)

Take the filePicker object and insert an entry in the database.

#### setUserPresence()

Record that the current user is connected to the website. If the user is visible (see `setInvisible`), broadcast the fact that he's online to his connections.

#### setInvisible(invisible)

If `invisible`, stop broadcasting the user online status to his connections, otherwise keep broadcasting.

## (Not So) FAQ

### Does it scale?

No idea. Does Meteor scale? If I/you run into a scaling issue, then success is at the door. Then I/you can invest time and money to ensure it scales.

### Can it do X. Y or Z

Probably not, but feel free to fork it.

## License stuff

This project is licensed with the MIT license.

## Contributors
- [Emmanuel Prochasson](https://github.com/eprochasson/)
