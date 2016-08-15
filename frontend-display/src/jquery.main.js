/**
 * Created by Artur on 09.08.2016.
 */

/* Variables */
var username;
var socket = io.connect("http://localhost:6969/chat")

/* ON LOAD */
$(document).ready(function() {
    
    // Send message when enter pressed in text box
    $('#type-message').keydown(function(ee) {
        if(ee.keyCode == 13) {
            sendMessage();
        }
    })
    
    // Show about dialogue
    $('.about-button').click(function() {
        $('.about-dialogue').slideDown();
    })
    
    // Hide about dialogue
    $('.close').click(function() {
        $('.about-dialogue').slideUp();
    })
    
    $('#end').click(endConvo)
})

/* Sending and Receiving Messages */
socket.on("message", function(data) {
    if(data.username != username) {
        receiveMessage(data);
    }
})

function receiveMessage(data) {
    // Get username and message
    var match_username = data.username;
    var match_message = data.message;
    
    // Add message to the chat window
    var received_message = "<li class='message'> <span class='user-name match'>" +
                                match_username +
                                "</span> <span class='message-text'>" +
                                match_message +
                                "</span> </li>";
    $('.message-list').append(received_message);
}

function sendMessage() { 
    // Add message to the chat window
    var client_message = "<li class='message'> <span class='user-name me''>" +
                                username +
                                "</span> <span class='message-text'>" +
                                $('#type-message').val() +
                                "</span> </li>";
    $('.message-list').append(client_message);
    
    // Clear text entry
    $('#type-message').val("");

    socket.send({username:username, message:client_message})  
}

/* MISC FUNCTIONS */
function endConvo() {
    confirm("You are about to end the conversation.");
}

// Toggle the typing indicator 
function typingIndicator() {
    
}

/* Main stuff happens below!!! */
(function ($) {
    var view_enter_name = $.get('views/enter-name.html', function (enter_name) {
        $('.content').append(enter_name);
    });

    var view_chat_section = $.get('views/chat-section.html', function (chat_section) {
        $('.content').append(chat_section);
    });
    
    var view_chat_section = $.get('views/about-float.html', function (about_float) {
        $('.content').append(about_float);
    });

    $.when(view_enter_name, view_chat_section).done(function () {
        $('.enter-name').slideDown();
        $('.enter-name .btn').click(function (event) {
            
            if(($('#name').val()) == "") {
               alert("Error: No name has been entered!");
            }
            else {
            event.preventDefault();
            $('.enter-name .btn').prop('disabled', true).html('Loading...');
            username = $('#name').val();
            setTimeout(function () {
                $('.enter-name').slideUp();
            }, 1000); //simulate connecting with back-end
            setTimeout(showChat, 2000);  
            }
        });

        function showChat () {
            $('.chat-section').slideDown();

            //moved this here to prevent the timer from starting upon page loading
            var start = new Date;
            setInterval(function () {
                
                //total length of time you want the conversation to be
                var totalTime = 180;
                
                var time = totalTime - Math.floor((new Date - start) / 1000);
                var countdown = function(){
                    if(time > 0){
                        return time;
                    }
                    else if(time == 0){
                        endConvo(); //ends conversation when the timer reaches 0
                        $('.chat-section').slideUp();
                    }
                }
                $('#timer').text(countdown() + " seconds");
            }, 1000);
        }
    })
})(jQuery);

