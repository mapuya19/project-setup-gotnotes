const deepEqualInAnyOrder = require('deep-equal-in-any-order');
const chai = require('chai');
const { expect } = chai;
chai.use(deepEqualInAnyOrder);

var ChatService = require('./index')
let chatData = ChatService.chatData
const testChat = chatData[0];

describe('ChatService', function () {
    describe('get_chatName()', function () {
        it('Should return chat data ', function () {

            const chat = ChatService.get_chatName(testChat.courseID)

            expect(chat[0]).to.deep.equalInAnyOrder(testChat);

        });
    });
});

describe('ChatService', function () {
    describe('get_Chat_Users()', function () {
        it('Should return chat users ', function () {

            const chat = ChatService.get_Chat_Users(testChat.courseID,testChat.chatName)

            expect(chat[0]).to.deep.equalInAnyOrder(testChat);

        });
    });
});



