import React, { useEffect, useState } from 'react';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import './Chat.css';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
let socket;

const Chat = () => {
  const location = useLocation();

  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const ENDPOINT = 'http://localhost:4001';

  /*useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);
    setName(name);
    setRoom(room);
    // console.log('Check ',socket)

    socket.emit('join', { name, room });

    return () => {
      // socket.emit('disconnect');
      socket.disconnect();
    };
  }, [ENDPOINT, location.search]);*/

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    if (name && room) {
      socket = io(ENDPOINT);
      setName(name);
      setRoom(room);

      socket.emit('join', { name, room });

      return () => {
        socket.disconnect();
      };
    }
  }, [ENDPOINT, location.search]);

  /**
 |---------------------------------
 | Function for Sending Messages
 |---------------------------------
 */
  useEffect(() => {
    socket.on('message', (message) => {
      setMessages([...messages, message]);
    });
  }, [messages]);

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  };

  console.log(message, messages);

  return (
    <>
      <div className="outerContainer">
        <div className="container">
          <InfoBar room={room} />
          {/* <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={(event) =>
              event.key === 'Enter' ? sendMessage(event) : null
            }
          /> */}
          <Messages
            messages={messages}
            name={name}
          />
          <Input
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
          />
        </div>
        <TextContainer users={users} />
      </div>
    </>
  );
};
export default Chat;
