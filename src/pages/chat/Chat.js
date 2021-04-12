import React from "react";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    Sidebar,
    ConversationList,
    Conversation,
    Avatar,
    ExpansionPanel,
    ConversationHeader,
    InfoButton,
    TypingIndicator,
    MessageSeparator,
} from "@chatscope/chat-ui-kit-react";
import axios from "axios";
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import socketClient from 'socket.io-client';

var options = {
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
            "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        "Content-type": "Application/json",
    },
};

export default class Chat extends React.Component {
    
    constructor(props) {
        super(props);
        var socket = socketClient("http://proevento.tk:3000");

        this.state = {
            chatType: "0",
            chatRoomList: [],
            currentUser: null,
            currentRoomIndex: 0,
            currentRoom: null,
            socket: socket,
            messageList: null
        };
        this.onChangeChatType = this.onChangeChatType.bind(this);
        this.loadChatRooms = this.loadChatRooms.bind(this);
        this.loadCurrentUser = this.loadCurrentUser.bind(this);
        this.onSendMessage = this.onSendMessage.bind(this);
        this.loadChatMessages = this.loadChatMessages.bind(this);

        this.loadChatRooms();
        this.loadCurrentUser();
        this.getChatMessagesFromSocket();
    }

    loadCurrentUser() {
        const user = localStorage.getItem("user");
        axios.get(`http://proevento.tk:3000/user/` + user)
        .then((res) => {
            if (res.status === 200) {
                this.setState({currentUser: res["data"]});
            }
        });
    }

    loadChatRooms(){
        if (this.state.chatType == "0") {
            const user = localStorage.getItem("user");
    
            axios.get(`http://proevento.tk:3000/chat/user_chat/` + user)
            .then((res) => {
                if (res.status === 200) {
                    this.setState({chatRoomList: res["data"]});
                    if (this.state.chatRoomList.length > 0) {
                        this.onChangeChatRoom(0);
                    }
                }
            });
        }
        else {

        }
    }

    loadChatMessages() {
        axios.get(`http://proevento.tk:3000/chat/chat_messages/` + this.state.chatType + "/" + this.state.currentRoom["roomId"])
        .then((res) => {
            if (res.status === 200) {
                this.setState({messageList: res["data"]});
                console.log(res["data"]);
            }
        });
    }

    getChatMessagesFromSocket() {
        this.state.socket.on("get_message", (data) => {
            if (data["roomId"] == this.state.currentRoom["roomId"] && 
                data["chatType"] == this.state.chatType) {
                console.log(this.state.messageList)
                const messageList = this.state.messageList;
                messageList.push(data);
                this.setState({messageList: messageList});
            }
            
        })
    }

    onChangeChatType(value) {
        if (this.state.chatType != value) {
            this.setState({chatType: value, currentRoomIndex: 0, currentRoom: null, messageList: null}, () => {
                this.loadChatRooms();
            });
        }  
    }

    onChangeChatRoom(index) {
        const temp = this.state.chatRoomList[index];
        if (this.state.currentRoom)
            this.state.socket.emit("leave", {roomId: this.state.currentRoom["roomId"], chatType: this.state.chatType});
        this.setState({currentRoomIndex: index, currentRoom: temp, messageList: null}, () => this.loadChatMessages());
        this.state.socket.emit("join", {roomId: temp["roomId"], chatType: this.state.chatType});
    }

    onSendMessage(message) {
        const userId = localStorage.getItem("user");
        this.state.socket.emit('send_message', {
            userId: userId, 
            roomId: this.state.currentRoom["roomId"], 
            chatType: this.state.chatType,
            message: message
        });
    }

    render() {
        return (
            <div style={{ height: "100%" }}>
                <MainContainer responsive>
                    <Sidebar position="left" scrollable={false}>
                        {/* <Search placeholder="Search..." /> */}
                        <div className="d-flex mt-2">
                            <ButtonGroup
                                className="justify-content-center w-100 ml-2 mr-2"
                                color="primary"
                                aria-label="outlined primary button group"
                            >
                                <Button 
                                    className="w-50"
                                    variant= { (this.state.chatType == 0) ? "contained" : "outlined" } 
                                    onClick={() => this.onChangeChatType(0)}>
                                    User Chat
                                </Button>
                                <Button 
                                    className="w-50"
                                    variant= { (this.state.chatType == 1) ? "contained" : "outlined" } 
                                    onClick={() => this.onChangeChatType(1)}>
                                    Group Chat
                                </Button>
                            </ButtonGroup>
                        </div>

                        <ConversationList>
                            { this.state.chatType == 0 &&
                                this.state.chatRoomList.map((room, index) => {
                                return (
                                    <Conversation
                                        key={room["roomId"]}
                                        onClick={() => this.onChangeChatRoom(index)}
                                        className="align-items-center"
                                        name={room["chatUser"]["fullName"]}
                                        // lastSenderName="Lilly"
                                        // info="Yes i can do it for you"
                                    >
                                        <Avatar
                                            src={room["chatUser"]["profileImage"]}
                                            name={room["chatUser"]["fullName"]}
                                        />
                                    </Conversation>
                                )})
                            }
                        </ConversationList>
                    </Sidebar>
                    
                    <ChatContainer>
                    
                        <ConversationHeader>
                            <ConversationHeader.Back />
                            
                            { this.state.chatType == 0 && this.state.currentRoom &&
                                <Avatar
                                    src={this.state.currentRoom["chatUser"]["profileImage"]}
                                    name={this.state.currentRoom["chatUser"]["fullName"]}
                                />
                            }
                            
                            <ConversationHeader.Content
                                userName={ ( this.state.chatType == 0 && this.state.currentRoom && 
                                            this.state.currentRoom["chatUser"]["fullName"]) 
                                        || ( this.state.chatType == 1 && "testing")}
                                // info="Active 10 mins ago"
                            />
                            
                            <ConversationHeader.Actions>
                                <InfoButton />
                            </ConversationHeader.Actions>
                        </ConversationHeader>
                        {/* typingIndicator={<TypingIndicator content="Zoe is typing" />} */}
                        <MessageList>
                            {/* <MessageSeparator content="Saturday, 30 November 2019" /> */}
                            { this.state.messageList && 
                            this.state.messageList.map((message, index) => {
                                const userId = localStorage.getItem("user");
                                var position = "single";
                                if (index == 0) {
                                    if (this.state.messageList.length == 1)
                                        position = "single";
                                    else if (this.state.messageList[0]["userId"] != this.state.messageList[1]["userId"])
                                        position = "single";
                                    else position = "first";
                                }
                                else if (index == this.state.messageList.length - 1) {
                                    if (this.state.messageList[index - 1]["userId"] != this.state.messageList[index]["userId"])
                                        position = "single";
                                    else position = "last";
                                } 
                                else {
                                    if (this.state.messageList[index - 1]["userId"] != this.state.messageList[index]["userId"]
                                    && this.state.messageList[index]["userId"] != this.state.messageList[index + 1]["userId"])
                                        position = "single";
                                    else if (this.state.messageList[index - 1]["userId"] != this.state.messageList[index]["userId"])
                                        position = "first";
                                    else if (this.state.messageList[index]["userId"] != this.state.messageList[index + 1]["userId"])
                                        position = "last";
                                    else position = "normal";
                                }
                                    
                                var chatModel = {
                                    message: message["message"],
                                    sender: message["chatUser"]["fullName"],
                                    direction: (userId == message["chatUser"]["userId"]) ? "outgoing" : "incoming",
                                    position: position
                                };
                                return (
                                    <Message
                                        key={message["messageId"]}
                                        model={chatModel}
                                        avatarSpacer={ position == "normal" || position == "first"}
                                    >
                                    { (position == "single" || position == "last") &&
                                        <Avatar
                                            src={message["chatUser"]["profileImage"]}
                                            name={message["chatUser"]["fullName"]}
                                        />
                                    }
                                    </Message>
                                )
                            })}
                        </MessageList>
                        {/* value={messageInputValue} onChange={val => setMessageInputValue(val)} onSend={() => setMessageInputValue("")} */}
                        <MessageInput onSend={this.onSendMessage} attachButton={false} placeholder="Type message here" />
                    </ChatContainer>

                    <Sidebar position="right">
                        <ExpansionPanel open title="Users">
                            { this.state.chatType == 0 && this.state.currentUser && this.state.currentRoom &&
                                <div>
                                    <div className="d-flex align-items-center mt-3 ml-3">
                                        <Avatar
                                            src={this.state.currentUser["profileImage"]}
                                            name={this.state.currentUser["fullName"]}
                                            style={{height:"25px", width:"25px"}}
                                        />
                                        <span className="ml-1">{this.state.currentUser["fullName"]}</span>
                                    </div>
                                    <div className="d-flex align-items-center mt-3 ml-3">
                                        <Avatar
                                            src={this.state.currentRoom["chatUser"]["profileImage"]}
                                            name={this.state.currentRoom["chatUser"]["fullName"]}
                                            style={{height:"25px", width:"25px"}}
                                        />
                                        <span className="ml-1">{this.state.currentRoom["chatUser"]["fullName"]}</span>
                                    </div>
                                </div>
                            }
                        </ExpansionPanel>
                    </Sidebar>
                </MainContainer>
            </div>
        );
    }
}
