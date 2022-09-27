import React from 'react';
import './Register.css';
import { Form, Input, Button, Col, Row } from 'antd';
import axios from 'axios';
import { BASE_URL } from '../env';
import { Navigate, useNavigate, Link } from "react-router-dom";

const Register = () => {
    const navigator = useNavigate();
    const tryRegister = (values: any) => {
        console.log("Base_url: ", BASE_URL);
        axios.post(BASE_URL + '/api/register', {
            user_id: values.user_id,
            password: values.password,
            firstName: values.firstname,
            lastName: values.lastname
        }).then(() => {
            navigator(`/`);

        }).catch(function (error) {
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
            <Form name="form" onFinish={tryRegister}>
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
                                    message: "Required field"
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
                                    message: "Required field"
                                },
                            ]}
                        >
                            <Input type="password" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={6}>
                        Confirm password
                    </Col>
                    <Col span={18}>
                        <Form.Item
                            name={'password-confirm'}
                            rules={[
                                {
                                    required: true,
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }

                                        return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                    },
                                }),
                            ]}
                        >
                            <Input type="password" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={6}>
                        Firstname
                    </Col>
                    <Col span={18}>
                        <Form.Item
                            name={'firstname'}
                            rules={[
                                {
                                    required: true,
                                    message: "Required field"
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={6}>
                        Lastname
                    </Col>
                    <Col span={18}>
                        <Form.Item name={'lastname'}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item wrapperCol={{ offset: 0 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
                <Link to="/"> Go back to Login Page </Link>
            </Form>
        </div>
    );
}

export default Register;
