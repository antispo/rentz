curl -X POST -H 'ContentType: application/json' \
    -d '{ "timestamp": "1577428217976" }' http://localhost:3002/games/add

curl -s http://localhost:3002/games

curl -s http://localhost:3002/games/5e05af3c16694d3802c6e52b

curl -s -X POST -H 'ContentType: application/jsos' \
    -d '{ "timestamp": "1577431054787" }' http://localhost:3002/games/update/5e05af3c16694d3802c6e52b