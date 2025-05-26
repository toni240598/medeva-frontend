// src/pages/Login.jsx
import { useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [usernameTouched, setUsernameTouched] = useState(false);

    const [password, setPassword] = useState('');
    const [passwordTouched, setPasswordTouched] = useState(false);


    const isUsernameInvalid = usernameTouched && username.trim() === '';
    const isPasswordInvalid = passwordTouched && password.trim() === '';
    const isFormValid = username.trim() !== '' && password.trim() !== '';

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data: { token } } = await login(username, password);
        localStorage.setItem('token', token); // Simpan token
        navigate('/'); // Redirect ke halaman home
    };

    return (
        <Container className="d-flex align-items-center justify-content-center min-vh-100">
            <Row className="w-100 justify-content-center">
                <Col xs={12} sm={8} md={6} lg={4}>
                    <Card className="p-4 shadow">
                        <Card.Body>
                            <h3 className="text-center mb-4">Login</h3>
                            <Form onSubmit={handleSubmit} noValidate>
                                <Form.Group className="mb-3" controlId="username">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Masukkan username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        onBlur={() => setUsernameTouched(true)}
                                        isInvalid={isUsernameInvalid}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Username wajib diisi.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Masukkan password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onBlur={() => setPasswordTouched(true)}
                                        isInvalid={isPasswordInvalid}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Password wajib diisi.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100" disabled={!isFormValid}>
                                    Login
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
