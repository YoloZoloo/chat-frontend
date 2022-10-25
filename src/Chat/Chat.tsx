import { Button, Col, Form, Input, List, Row } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import 'antd/dist/antd.css';
import './Chat.css';
import { Breadcrumb, Layout, Menu } from 'antd';
import axios from 'axios';
import { BASE_URL } from '../env';
import { BASE_WEBSOCKET_URL } from '../env';
import { Navigate, useNavigate } from 'react-router-dom';

const { Content, Footer, Sider } = Layout;

const Chat = () => {
  const NOT_SELECTED = -1;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigator = useNavigate();
  let token = localStorage.getItem('token');
  const name = localStorage.getItem('name');
  const uniqID = localStorage.getItem('uniqID');
  const [form] = Form.useForm();

  const [websocket, setWSClient] = useState<WebSocket>();
  const [isLoading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [roomIDs, setRoomID] = useState([]);
  const [privChatIDs, setprivChatIDs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [prevMessages, setPrevMessages] = useState([]);
  const [peerID, setPeerID] = useState(Number);
  const [currentChatRoom, setChatRoom] = useState(Number);


  useEffect(() => {
    if (BASE_WEBSOCKET_URL === undefined) {
      throw Error
    }
    setWSClient(new WebSocket(BASE_WEBSOCKET_URL));
  }, []);
  useEffect(() => {
    setPrevMessages(messages);
    scrollToLastMessage();
  }, [messages]);

  useEffect(() => {
    if (token === null) {
      token = "";
    }
    axios.get(BASE_URL + "/api/chatscreen/getChatRooms", {
      headers: {
        Authorization: token
      }
    })
      .then(response => {
        const RoomID = response.data.grouproom_id;
        const privRoomID = response.data.privateroom_id;
        if (privChatIDs != null) {
          setprivChatIDs(privRoomID);
        }
        else {
          setprivChatIDs([]);
        }
        if (RoomID != null) {
          setRoomID(RoomID);
        }
        else {
          setRoomID([]);
        }
        setLoading(false);
      }
      )
      .catch(err => {
        console.log(err);
        localStorage.clear();
        navigator("/");
      });
  }, [isLoading]);

  const logOut = () => {
    localStorage.clear();
    navigator("/");
  }

  const getChat = (room_id: number) => {
    setChatRoom(room_id);
    setPeerID(NOT_SELECTED);
    if (token === null) {
      token = "";
    }
    const data = JSON.stringify({ room: room_id })
    axios.post(BASE_URL + "/api/chatscreen/getGroupChat", data, {
      headers: {
        "Authorization": token
      },
    })
      .then(response => {
        if (response.data !== null) {
          setMessages(response.data);
        }
        else {
          setMessages([]);
        }
      }
      )
      .catch(err => {
        // show the error
        localStorage.clear();
        console.log(err);
      });
  }

  const getPeerChat = (peerID: number) => {
    setPeerID(peerID);
    setChatRoom(NOT_SELECTED)
    if (token === null) {
      token = "";
    }
    const data = JSON.stringify({ peer: peerID })
    axios.post(BASE_URL + "/api/chatscreen/getPrivateChat", data, {
      headers: {
        "Authorization": token
      },
    })
      .then(response => {
        if (response.data !== null) {
          setMessages(response.data);
        }
        else {
          setMessages([]);
        }
      }
      )
      .catch(err => {
        // show the error
        localStorage.clear();
        console.log(err);
      });
  }

  const sendChat = (value: any) => {
    if (value.message === '') {
      return
    }
    let postData = JSON.stringify({
      connect: false, senderID: uniqID,
      chatroom: currentChatRoom, message: value.message, name: name,
      peerID: peerID
    });
    if (websocket !== undefined) {
      websocket.send(postData)
    };
    form.setFieldValue("message", '');
  }

  if (websocket !== undefined) {
    websocket.onopen = () => {
      websocket.send(JSON.stringify({ connect: true, user_id: uniqID }));
    };

    websocket.onmessage = (message) => {
      const msg = JSON.parse(message.data);
      console.log(msg);
      console.log(msg.peerID);
      console.log(peerID);
      console.log(currentChatRoom);
      if ((peerID == msg.senderID || peerID == msg.peerID) && currentChatRoom == msg.room) {
        const newList = prevMessages.concat(msg);
        setMessages(newList);
      }
    }
    websocket.onclose = () => {
      setTimeout(function () {
        websocket.send(JSON.stringify({ connect: true, user_id: uniqID }));
      }, 1000);
    }
    websocket.onerror = (err) => {
      console.error('Socket encountered error: ', err, 'Closing socket');
      websocket.close();
    }
  }

  const scrollToLastMessage = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // rendering part
  const loginState = localStorage.getItem("isLoggedIn");
  if (loginState !== '1') {
    return (
      <Navigate to="/" />
    );
  }
  return (
    <Layout
      style={{
        minHeight: '100vh',
        maxHeight: '100vh'
      }}
    >
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="logo"></div>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" />
        {
          roomIDs?.map((elem: any) => <div key={elem}>
            <Button key={elem}
              className='roomsButton'
              onClick={() => getChat(elem)}
            >
              Group {elem}
            </Button>
          </div>
          )
        }
        <><br /><br /></>
        {
          privChatIDs?.map((elem: any) => <div key={elem.id}>
            <Button key={elem.id}
              className='roomsButton'
              onClick={() => getPeerChat(elem.id)}
            >
              {elem.user_id}
            </Button>
          </div>
          )
        }
        <Button onClick={logOut}
          className='logoutButton'
        >Log Out</Button>
      </Sider>
      <Layout className="site-layout">
        <div className="screen-header">{"Chatscreen"}</div>
        <Content
          style={{
            margin: '0 16px',
          }}
        >
          <Breadcrumb
            style={{
              margin: '16px 0',
            }}
          >
            <Breadcrumb.Item>Hello, {name}!</Breadcrumb.Item>
          </Breadcrumb>
          <div className="chat-box">
            <List
              id="scroll-list"
              size="large"
              dataSource={messages}
              style={{ border: 0, zIndex: 1 }}
              renderItem={(message: any) => <List.Item>{message.dateName} - {message.message}</List.Item>}
            />
            <div style={{ float: "left", clear: "both" }} ref={messagesEndRef} />
          </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
            paddingBottom: '0px',
            height: '72px',
            zIndex: 2,
          }}
        >
          <Form form={form} onFinish={sendChat}>
            <Row>
              <Col span={21}>
                <Form.Item name={"message"}>
                  <Input id='chat-input'></Input>
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item>
                  <Button htmlType='submit' type="primary">Send</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Footer>
      </Layout>
    </Layout>

  );
};

export default Chat;
