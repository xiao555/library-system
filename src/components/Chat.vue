<template lang="html">
  <div class="chatComponent">
    <div class="chat-button" @click="toggleChat">
      <i class="fa fa-comment-o" aria-hidden="true"></i>
      <div class="tips" v-if="showTip">
        {{ unreadMsg }}
      </div>
    </div>
    <transition name="fade">
      <div class="chatroom" v-if="showChat" @keyup.esc="toggleChat">
        <ul class="pages">
          <li class="login page" v-if="chatLogin">
            <div class="form">
              <h3 class="title">What's your nickname?</h3>
              <input class="usernameInput" type="text" maxlength="14" v-model="nickname" v-on:keyup.enter="loginChat"/>
            </div>
          </li>
          <li class="chat page" v-else>
            <div class="chatArea">
              <ul class="messages">
                <li v-for="message in messages">
                  <div class="log" v-if="message.type == 'log'">
                    {{ message.content }}
                  </div>
                  <div class="message" v-else-if="message.type == 'message'">
                    <span class="username" :style="'color:' + message.color + ';'">{{ message.user }}</span>
                    <span class="messageBody">{{ message.content }}</span>
                  </div>
                </li>
              </ul>
            </div>
            <input class="inputMessage" placeholder="Type here..." v-model="inputMessage" v-on:keyup.enter="sendMessage"/>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
import io from 'socket.io-client'
import xssFilters from 'xss-filters'

export default {

  data () {
    return {
      showChat: false,
      nickname: '',
      username: '',
      FADE_TIME: 150,
      TYPING_TIMER_LENGTH: 400,
      COLORS: [
        '#e21400', '#91580f', '#f8a700', '#f78b00',
        '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
        '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
      ],
      connected: false,
      messages: [],
      chatLogin: true,
      socket: {},
      inputMessage: "",
      typing: false,
      lastTypingTime: "",
      unreadMsg: 0,
      showTip: false
    }
  },

  watch: {
    inputMessage: function (val) {
      this.updateTyping()
    },
    unreadMsg: function (val) {
      if (this.unreadMsg > 0) {
        this.showTip = true;
      }
    }
  },

  mounted () {
    this.socket = io('http://localhost:8007');
  },

  methods: {
    initSocketEvent () {
      // Whenever the server emits 'login', log the login message
      this.socket.on('login', data => {
        this.connected = true;
        // Display the welcome message
        var message = "Welcome to Library Chat – ";
        this.logMessage(message, {
          prepend: true
        });
        this.addParticipantsMessage(data);
      });

      // Whenever the server emits 'new message', update the chat body
      this.socket.on('new message', data => {
        this.addChatMessage(data);
      });

      // Whenever the server emits 'user joined', log it in the chat body
      this.socket.on('user joined', data => {
        this.logMessage(data.username + ' joined');
        this.addParticipantsMessage(data);
      });

      // Whenever the server emits 'user left', log it in the chat body
      this.socket.on('user left', data => {
        this.logMessage(data.username + ' left');
        this.addParticipantsMessage(data);
        this.removeChatTyping(data);
      });

      // Whenever the server emits 'typing', show the typing message
      this.socket.on('typing', data =>{
        this.addChatTyping(data);
      });

      // Whenever the server emits 'stop typing', kill the typing message
      this.socket.on('stop typing', data => {
        this.removeChatTyping(data);
      });

      this.socket.on('disconnect', () => {
        this.logMessage('you have been disconnected');
      });

      this.socket.on('reconnect', () => {
        this.logMessage('you have been reconnected');
        if (this.username) {
          this.socket.emit('add user', this.username);
        }
      });

      this.socket.on('reconnect_error', () => {
        this.logMessage('attempt to reconnect has failed');
      });
    },
    toggleChat ()  {
      this.chatLogin = this.username === ''
      this.showChat = !this.showChat
      setTimeout(() => {
        let messageArea = document.querySelector('.messages')
        if (messageArea) {
          messageArea.scrollTop = messageArea.scrollHeight - messageArea.offsetHeight
          this.showTip = false
          this.unreadMsg = 0
        }
      }, 1000)
    },
    loginChat () {
      this.username = this.nickname
      this.chatLogin = false
      this.initSocketEvent()
      this.username = xssFilters.inHTMLData(this.username)
      this.socket.emit('add user', this.username)
    },
    // Log a message
    logMessage (message, options = {}) {
      var data = {
        type: 'log',
        content: message
      }
      this.messages.push(data)
      let messageArea = document.querySelector('.messages');
      if (messageArea) {
        messageArea.scrollTop = messageArea.scrollHeight - messageArea.offsetHeight
      } else {
        this.unreadMsg++
      }
    },
    addParticipantsMessage (data) {
      var message = '';
      if (data.numUsers === 1) {
        message += "there's 1 participant";
      } else {
        message += "there are " + data.numUsers + " participants";
      }
      this.logMessage(message);
    },
    // Adds the visual chat message to the message list
    addChatMessage (data, options = {}) {
      this.removeChatTyping(data)

      let message = {
        type: 'message',
        user: data.username,
        content: data.message,
        color: this.getUsernameColor(data.username)
      }
      console.log(message);

      this.messages.push(message)
      let messageArea = document.querySelector('.messages')
      if (messageArea) {
        messageArea.scrollTop = messageArea.scrollHeight - messageArea.offsetHeight
      } else if (message.content !== 'is typing') {
        this.unreadMsg++
      }
    },
    // Removes the visual chat typing message
    removeChatTyping (data) {
      var i;
      for (var i = this.messages.length - 1; i >= 0; i--) {
        if (this.messages[i].content == 'is typing' && this.messages[i].user == data.username) break
      }
      if (i >= 0) {
        console.log(i);
        this.messages.splice(i, 1)
      }
    },
    // Adds the visual chat typing message
    addChatTyping (data) {
      data.message = 'is typing';
      this.addChatMessage(data);
    },
    // Updates the typing event
    updateTyping () {
      if (this.connected) {
        if (!this.typing) {
          this.typing = true;
          this.socket.emit('typing');
        }
        this.lastTypingTime = (new Date()).getTime()

        setTimeout(() => {
          var typingTimer = (new Date()).getTime();
          var timeDiff = typingTimer - this.lastTypingTime;
          if (timeDiff >= this.TYPING_TIMER_LENGTH && this.typing) {
            this.socket.emit('stop typing');
            this.typing = false;
          }
        }, this.TYPING_TIMER_LENGTH);
      }
    },
    // Sends a chat message
    sendMessage () {
      // Prevent markup from being injected into the message
      this.inputMessage = xssFilters.inHTMLData(this.inputMessage)
      // if there is a non-empty message and a socket connection
      if (this.inputMessage && this.connected) {
        console.log(this.username);
        this.addChatMessage({
          username: this.username,
          message: this.inputMessage
        });
        // tell server to execute 'new message' and send along one parameter
        this.socket.emit('new message', this.inputMessage)
        this.inputMessage = ''
        this.socket.emit('stop typing');
        this.typing = false;
      }
    },
    // Gets the color of a username through our hash function
    getUsernameColor (username) {
      // Compute hash code
      var hash = 7;
      for (var i = 0; i < username.length; i++) {
         hash = username.charCodeAt(i) + (hash << 5) - hash;
      }
      // Calculate color
      var index = Math.abs(hash % this.COLORS.length);
      return this.COLORS[index];
    }
  }
}
</script>

<style lang="stylus">
.chat-button
  position fixed
  right 20px
  bottom 20px
  width 50px
  height 50px
  border none
  border-radius 50%
  background #706AA1
  line-height 50px
  text-align center
  cursor pointer
  transition all .8s cubic-bezier(0.18, 0.89, 0.32, 1.28)
  color white
  &:hover
    background #7CD5B1
    i
      font-size 24px
  i
    font-size 20px
  .tips
    position absolute
    top -5px
    right -5px
    width 20px
    height 20px
    border-radius 50%
    background red
    color #fff
    font-size 12px
    line-height 20px

.chatroom
  position fixed
  right 20px
  bottom 80px
  width 400px
  height 500px
  border-radius 10px
  z-index 999999
  transition all .8s cubic-bezier(0.18, 0.89, 0.32, 1.28)
  &:after
    content ''
    display block
    position absolute
    right 15px
    bottom -20px
    width 0
    height 0
    border 10px solid #706AA1
    border-left-color transparent
    border-right-color transparent
    border-bottom-color transparent
  .pages
    height 100%
    margin 0
    padding 0
    width 100%
    .page
      height 100%
      position absolute
      width 100%
      background #fff
      border-radius 10px
      &.login
        background-color #706AA1
        .form
          height 100px
          margin-top -100px
          position absolute
          text-align center
          top 50%
          width 100%
          color #fff
          font-weight 100
          .usernameInput
            background-color transparent
            border none
            border-bottom 2px solid #fff
            outline none
            padding-bottom 15px
            text-align center
            width 80%
            letter-spacing 3px
            color #fff
            font-size 150%
          .title
            font-size 150%

.inputMessage
  font-size 100%

.log
  color gray
  font-size 70%
  margin 5px
  text-align center

.chatArea
  height 100%
  padding-bottom 60px
  border 10px solid #706AA1
  border-radius 10px

.messages
  font-size 150%
  height 100%
  margin 0
  overflow-y scroll
  padding 10px 20px 40px 20px

.message.typing .messageBody
  color gray

.username
  font-weight 700
  overflow hidden
  padding-right 15px
  text-align right

.inputMessage
  border 10px solid #706AA1
  border-radius 10px
  bottom 0
  height 60px
  left 0
  outline none
  padding-left 10px
  position absolute
  right 0
  width 100%
</style>
