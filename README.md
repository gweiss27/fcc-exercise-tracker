# Exercise Tracker REST API

#### A microservice project, part of Free Code Camp's curriculum

### User Stories

1. I can create a user by posting form data username to /api/exercise/new-user and returned will be an object with username and _id.
2. I can get an array of all users by getting api/exercise/users with the same info as when creating a user.
3. I can add an exercise to any user by posting form data userId(_id), description, duration, and optionally date to /api/exercise/add. If no date supplied it will use current date. Returned will be the user object with also with the exercise fields added.
4. I can retrieve a full exercise log of any user by getting /api/exercise/log with a parameter of userId(_id). Return will be the user object with added array log and count (total exercise count).
5. I can retrieve part of the log of any user by also passing along optional parameters of from & to or limit. (Date format yyyy-mm-dd, limit = int)

# NOTE on API Response Objects

Solution can be completed with either one Model (User) with an exercise property that is an array of exercise logs.

### or

TWO models: One User and One Log and a userId to link between them.

### Sample response output:

    {
        _id: "BJaDFbkrB",
        username: "Páska Béla",
        count: 10,
        log: [
            {
                description: "ttest",
                duration: 23,
                date: "Mon Oct 28 2019"
            },
            {
                description: "futás",
                duration: 120,
                date: "Mon Aug 26 2019"
            },
            {
                description: "futás",
                duration: 1200,
                date: "Mon Aug 26 2019"
            },
            {
                description: "futás",
                duration: 120,
                date: "Sun Aug 25 2019"
            },
            {
                description: "futás",
                duration: 120,
                date: "Sun Aug 25 2019"
            },
            {
                description: "séta",
                duration: 60,
                date: "Sun Aug 25 2019"
            },
            {
                description: "evés",
                duration: 60,
                date: "Wed Apr 04 1973"
            },
            {
                description: "evés",
                duration: 60,
                date: "Wed Apr 04 1973"
            },
            {
                description: "takaritas",
                duration: 60,
                date: "Thu Jan 01 1970"
            },
            {
                description: "takaritas",
                duration: 60,
                date: "Thu Jan 01 1970"
            }
        ]
    }