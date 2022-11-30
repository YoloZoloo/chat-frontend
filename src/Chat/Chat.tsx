import { Button, Col, Form, Input, List, Row } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import 'antd/dist/antd.css';
import './Chat.css';
import { Breadcrumb, Layout, Menu } from 'antd';
import { request } from '../axios/axios';
import { BASE_WEBSOCKET_URL } from '../env';
import { Navigate, useNavigate } from 'react-router-dom';
import store from "../reducers/reducer"

const { Content, Footer, Sider } = Layout;


interface Msg {
  message_id: number,
  message: string,
  peer_id: Number,
  sender_id: Number,
  dateName: string,
  chatroom: Number
}

interface PrivateChat {
  id: Number,
  user_id: Number
}

const Chat = () => {
  const NOT_SELECTED = -1;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigator = useNavigate();
  const userState: any = store.getState();
  console.log("userState:", userState.id);
  let token = userState.token;
  const name = userState.name;
  const uniqID = userState.id;
  const [form] = Form.useForm();

  const [websocket, setWSClient] = useState<WebSocket>();
  const [isLoading, setLoading] = useState<boolean>(true);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [roomIDs, setRoomID] = useState<Number[]>([]);
  const [privChatIDs, setprivChatIDs] = useState<Number[]>([]);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [prevMessages, setPrevMessages] = useState<Msg[]>([]);
  const [peerID, setPeerID] = useState<Number>();
  const [currentChatRoom, setChatRoom] = useState<Number>();


  useEffect(() => {
    if (BASE_WEBSOCKET_URL === undefined) {
      throw Error
    }
    setWSClient(new WebSocket(BASE_WEBSOCKET_URL));
  }, []);
  useEffect(() => {
    setPrevMessages(messages);
    scrollToLastMessage();
    console.log(messages);
  }, [messages]);

  useEffect(() => {
    if (token === null) {
      token = "";
    }
    request.get("/api/chatscreen/getChatRooms", {
      headers: {
        Authorization: token
      }
    })
      .then(response => {
        const RoomID = response.data.grouproom_id;
        const privRoomID = response.data.privateroom_id;
        if (privChatIDs !== null) {
          setprivChatIDs(privRoomID);
        }
        else {
          setprivChatIDs([]);
        }
        if (RoomID !== null) {
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
        store.dispatch({ type: "setAsLoggedOut" });
        // localStorage.clear();
        navigator("/");
      });
  }, [isLoading]);

  const logOut = () => {
    store.dispatch({ type: "setAsLoggedOut" });
    // localStorage.clear();
    navigator("/");
  }

  const getChat = (room_id: number) => {
    setChatRoom(room_id);
    setPeerID(NOT_SELECTED);
    if (token === null) {
      token = "";
    }
    const data = JSON.stringify({ room: room_id })
    request.post("/api/chatscreen/getGroupChat", data, {
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
        store.dispatch({ type: "setAsLoggedOut" });
        // localStorage.clear();
        console.log(err);
      });
  }

  const getPeerChat = (peerID: number) => {
    setPeerID(peerID);
    setChatRoom(NOT_SELECTED)
    if (token === null) {
      token = "";
    }
    const data = JSON.stringify({ peer_id: peerID })
    request.post("/api/chatscreen/getPrivateChat", data, {
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
        store.dispatch({ type: "setAsLoggedOut" });
        console.log(err);
      });
  }

  const sendChat = (value: any) => {
    if (value.message === '') {
      return
    }
    let postData = JSON.stringify({
      connect: false, sender_id: uniqID,
      chatroom: currentChatRoom, message: value.message, name: name,
      peer_id: Number(peerID)
    });
    if (websocket !== undefined) {
      websocket.send(postData)
    };
    form.setFieldValue("message", '');
  }

  if (websocket !== undefined) {
    websocket.onopen = () => {
      websocket.send(JSON.stringify({ connect: true, sender_id: uniqID }));
    };

    websocket.onmessage = (message) => {
      const msg: Msg = JSON.parse(message.data);
      if ((peerID == msg.sender_id || peerID == msg.peer_id) && currentChatRoom == msg.chatroom) {
        const newList: Msg[] = prevMessages.concat(msg);
        setMessages(newList);
      }
    }
    websocket.onclose = () => {
      setTimeout(function () {
        websocket.send(JSON.stringify({ connect: true, senderID: uniqID }));
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
  const loginState = userState.loggedIn;
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
