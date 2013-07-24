# Socialite
## A social-network app made with Meteor

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

## API

API is a big word, but here are a few of the useful helpers/methods implemented in Socialite.

### Publications

#### myData

The current user data: full profile, settings and if the profile is completed (to be able to display the profile creation flow otherwise).

On-ready, sets the `settings` and `profileComplete` Session variable. to indicate that 1. the profile is loaded and allow for easy access of those information.

#### myPictures

All the current user Photos.

#### myNotification

Notification for the current user, with potential related users (if the notification is "friend request from A", we also publish a light version of A's information, to display with the notification.

#### myFriendlist

All my friends (from Friends) and the related users information (Meteor.users.

#### myNews

Information happening to me and my interactions with other users (from Activities).

#### myConversations

The list of my current conversations with people, friend or not (from Conversations) and their info (from Meteor.users).

#### questions

The list of questions.

#### oneConversation

Depends on the Session variable `currentConversation`. Get some of the messages (from Messages) for a given conversation.

#### userProfile

Depends on the Session variable `currentUserProfile` (set when visiting a user profile). Publish user information from Meteor.users.

#### oneUserPicture

Publish pictures (from Photos) for the user set in `currentUserProfile`. TODO: merge with `userProfile`.

#### oneUserActivities

Publish activities for a given user (from `currentUserProfile`). TODO: merge with `userProfile`.

#### searchResults

Publish a list of users (from Meteor.users) matching a search query. On-ready, set the `searchQueryDone` Session variable, for client side update of the template.
Publish related Presences objects to know the online status of users in the search results.

### Collections

Not really API stuff, but help to understand the architecture of the app.

#### Meteor.users

The default Meteor.users collection, with nit much change. The profile information are stored in the `profile` field of a user document.

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

#### addAsFriend

#### removeFriend

#### sendMessage

#### uploadPhoto

#### setUserPresence

#### setInvisible


## License stuff

This project is licensed with the MIT license.

## Contributors
- [Emmanuel Prochasson](https://github.com/eprochasson/)