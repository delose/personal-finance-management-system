# Notification service

## Key features
Alerts, nudges, reminders


## Quick start
1. Dockerized MySQL

### 1-1. Start dockerized DB from MySQL image
```bash
docker run -d -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=secret --name notifdb -p 3308:27017 mongo:latest
```

### 1-2. Run the interactive MongoDB shell (mongosh)
```bash
docker exec -it notifdb mongosh -u admin -p secret

show dbs

use notifdb

show collections

db.notifications.insertOne({
  userId: "user123",
  type: "alert",
  message: "Budget exceeded!",
  status: "unread",
  createdAt: new Date()
})

db.notifications.find()

db.notifications.find({ userId: "user123", status: "unread" }).pretty()

db.notifications.countDocuments()

db.notifications.updateOne(
  { userId: "user123", status: "unread" },
  { $set: { status: "read" } }
)
  
db.notifications.deleteOne({ _id: ObjectId("replace_with_id_here") })

db.notifications.deleteMany({ status: "read" })

exit
```

### 1-3. Stop
```bash
docker stop notifdb
```

### 1-4. Remove DB instance
```bash
docker rm notifdb
```