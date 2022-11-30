import React from 'react';
import './Login.css';
import { Form, Input, Button, Col, Row } from 'antd';
import { Navigate, useNavigate, Link } from "react-router-dom";
import store, { UserState } from "../reducers/reducer"
import { initUser } from "../actions/actions"
import { request } from '../axios/axios';

const Login = () => {
  const navigator = useNavigate();
  const userState: any = store.getState();
  const tryLogin = (values: any) => {
    const username = values.username;
    const pass = values.password;
    request.post('/api/login', {
      user_id: username,
      password: pass
    }).then(response => {
      const data: UserState = {
        id: response.data.uniqID,
        name: response.data.userName,
        userName: username,
        token: response.data.token,
        loggedIn: "1",
      }
      store.dispatch(initUser(data));
      console.log(response.data);
      navigator(`/chat`);

    })
      .catch(function (error) {
        console.log(error);
      });
  }
  if (userState.loggedIn === '1') {
    return (
      <Navigate to="/chat" />
    );
  }
  return (
    <div className="App">
      <Form name="form" onFinish={tryLogin}>
        <Row>
          <Col span={6}>
            User ID:
          </Col>
          <Col span={18}>
            <Form.Item
              name={'username'}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            Password
          </Col>
          <Col span={18}>
            <Form.Item
              name={'password'}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input type="password" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item wrapperCol={{ offset: 0 }}>
          <Button type="primary" htmlType="submit">
            Sign in
          </Button>
        </Form.Item>
        <Link to="/register"> Sign Up </Link>
      </Form>
    </div>
  );
}

export default Login;
