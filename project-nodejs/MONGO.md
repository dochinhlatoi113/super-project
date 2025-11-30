
luon luon :
# Start MongoDB
brew services start mongodb-community

# Kiểm tra status
brew services list | grep mongodb

# Hoặc kiểm tra kết nối
mongosh --eval "db.adminCommand('ping')"

# Stop MongoDB
brew services stop mongodb-community

# Restart MongoDB
brew services restart mongodb-community
# connect
 mongosh

1: xem tat ca databse
show dbs

2: chon database mong muon 
use project-nodes (use ten database can)

3: show tabale da chon
show collections

4: xem du lieu 
db.ten_collection.find().pretty()

5 : xem du lieu co gioi han
db.ten_collection.find().limit(10).pretty()

6 : xem danh sách collection(table)
db.getCollectionNames()

7: xoá data của collection
db.users.deleteMany({})
