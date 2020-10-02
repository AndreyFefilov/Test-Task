import { Box, Button, Card, CardActions, CardContent, IconButton, InputAdornment, TextField, Typography } from '@material-ui/core'
import { AccountCircle, LockRounded, Visibility, VisibilityOff } from '@material-ui/icons';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import AuthService from '../services/AuthService';

const AuthForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const history = useHistory();

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    const handleChangeUsername = (e) => {
        setUsername(e.target.value);
    }

    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    }

    return (
        <form autoComplete="off">
            <Card className="auth-card" justify="center">
                <CardContent>
                    <Typography
                        color="textSecondary"
                        align="center"
                        variant="subtitle1"
                    >
                        Вход в систему
                    </Typography>
                    <Box className="input-box">
                        <Box className="input-box__field">
                            <AccountCircle className="input-box__field__icon"/>
                            <TextField
                                autoFocus
                                id="username"
                                label="Логин"
                                margin="normal"
                                className="my-input"
                                type="text"
                                onChange={handleChangeUsername}
                            />
                        </Box>
                        <Box className="input-box__field">
                            <LockRounded className="input-box__field__icon"/>
                            <TextField
                                id="password"
                                label="Пароль"
                                margin="normal"
                                className="my-input"
                                type={showPassword ? "text" : "password"}
                                onChange={handleChangePassword}
                                InputProps = {{endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                    )
                                }}
                            />
                        </Box>
                    </Box>
                </CardContent>
                <CardActions>
                    <Button
                        className="action-btn"
                        variant="contained"
                        color="primary"
                        disabled={(username.length < 1) || (password.length < 1)}
                        onClick = {() => {
                                const response = AuthService.login(username, password);
                                if(response) {
                                    history.push("/");
                                } else {
                                    alert("Неправильный логин или пароль");
                                }
                            }
                        }
                    >
                        Войти
                    </Button>
                </CardActions>
            </Card>
        </form>
    )
}

export default AuthForm;