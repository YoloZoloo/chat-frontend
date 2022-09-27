import React from 'react';
import './Login.css';
import { Form, Input, Button, Col, Row } from 'antd';
import axios from 'axios';
import { BASE_URL } from '../env';
import { Navigate, useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigator = useNavigate();
  const tryLogin = (values: any) => {
    const user_id = values.user_id;
    const pass = values.password;
    console.log("Base_url: ", BASE_URL);
    axios.post(BASE_URL + '/api/login', {
      user_id: user_id,
      password: pass
    }).then(response => {
      //here set token, unique id and user_id, password;
      localStorage.setItem('userName', user_id);
      localStorage.setItem('name', response.data.userName);
      localStorage.setItem('uniqID', response.data.uniqID);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('isLoggedIn', "1");
      console.log(response.data);
      navigator(`/chat`);

    })
      .catch(function (error) {
        console.log(error);
      });
  }
  if (localStorage.getItem('isLoggedIn') === '1') {
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
              name={'user_id'}
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
