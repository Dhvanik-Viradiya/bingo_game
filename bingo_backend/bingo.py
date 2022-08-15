import mimetypes
from flask import Flask, request, Response
from config import CONFIG
import pyrebase
import uuid
import os
import json
import base64
from flask_cors import CORS
import time


app = Flask(__name__)
CORS(app=app)

firebase = pyrebase.initialize_app(CONFIG)
db = firebase.database()

number_seq = {}
for i in range(1,26):
    number_seq[i]=False
number_seq["turn"]=0
number_seq["game_started"]=0
number_seq["game_win"]=-1

my_stream = ""

@app.route("/generate_token")
def generate_token():
    token = str(uuid.uuid4())[:4]
    return json.dumps({"token":str(token)})

@app.route("/set_token")
def set_token():
    token = request.args.get("token")
    print("token",token)
    print(type(token))
    db.child(token).set(number_seq)
    db.child(token).child("player").set({0:str(uuid.uuid4())})
    # db.child(token).update({"game_win":-1})
    # my_stream = db.child(token).stream(stream_handler, stream_id=str(token))

    # print(f"{my_stream=}")
    # print(f"{dir(my_stream)=}")
    return json.dumps({"status_code":200})

@app.route("/set_player")
def set_player():
    token = request.args.get("token")
    print("token",token)
    print(type(token))
    players = db.child(token).child("player").get()
    print(players)
    player_number= 0
    if not players.each():
        return json.dumps({"status_code":400})
    for player in players.each():
        player_number = max(player.key(),player_number)
        print(f"{player.key()=}")
        print(f"{player.val()=}")
    player_number+=1

    game_started = db.child(token).child("game_started").get()
    print(f"{game_started.val()=}")
    if game_started.val()==0:
        db.child(token).update({"game_started":1})
    else:
        return json.dumps({"status_code":201})
    # print(f"{players=}")
    # print(f"{dir(players)=}")
    # print(f"{players.val()=}")
    db.child(token).child("player").update({player_number:str(uuid.uuid4())})
    
    
    # my_stream = db.child(token).stream(stream_handler, stream_id=str(token))

    # print(f"{my_stream=}")
    # print(f"{dir(my_stream)=}")
    return json.dumps({"status_code":200, "my_turn":player_number})

@app.route("/button_clicked")
def button_clicked():
    button_number = request.args.get("button_number")
    token = request.args.get("token")
    button_number = int(button_number)
    print(button_number)
    players = db.child(token).child("player").get()
    current_turn = db.child(token).child("turn").get()
    player_number= []
    if players:
        for player in players.each():
            player_number.append(player.key())
            print(f"{player.key()=}")
            print(f"{player.val()=}")
        print(f"{player_number=}")
        turn_ind = player_number.index(current_turn.val())
        next_turn_ind = (turn_ind + 1)%len(player_number)
        next_turn = player_number[next_turn_ind]
        db.child(token).update({button_number:True})
        db.child(token).update({"turn":next_turn})

    return json.dumps({"status_code":200,"next_turn":next_turn})

@app.route("/game_win")
def game_win():
    player = request.args.get("player")
    token = request.args.get("token")
    player = int(player)
    print(player)
    game_win = db.child(token).child("game_win").get()
    print("game_win")
    print(game_win)
    print(game_win.val())
    if game_win.val()==-1:
        db.child(token).update({"game_win":player})
    # players = db.child(token).child("player").get()
    # current_turn = db.child(token).child("turn").get()
    # player_number= []
    # for player in players.each():
    #     player_number.append(player.key())
    #     print(f"{player.key()=}")
    #     print(f"{player.val()=}")
    # print(f"{player_number=}")
    # turn_ind = player_number.index(current_turn.val())
    # next_turn_ind = (turn_ind + 1)%len(player_number)
    # next_turn = player_number[next_turn_ind]
    # db.child(token).update({"turn":next_turn})
    # db.child(token).update({button_number:True})

    return json.dumps({"status_code":200})


# def eventStream(a):
#     # will send simple SSE style responses
#     while True:
#         time.sleep(5)
#         yield "data: {}\n\n".format(str(1))

# def hi(a):
#     yield "data: {}\n\n".format("hi")
# @app.route("/stream")
# def streaming():
#     # pass
#     # if my_stream:
#     return Response(eventStream([]), mimetype="text/event-stream")
# # def main():
    
    
    # db.child(1234567).set(number_seq)
# print(dir(app.run))

if __name__ == "__main__":
    CORS(app=app)
    print("running")
    app.run(debug=True)