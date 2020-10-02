import React, { useState } from 'react'
import { Container } from '@material-ui/core';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AuthForm from '../components/Auth.form';
import HelpIcon from '@material-ui/icons/Help';
import HtmlTooltip from '@material-ui/core/Tooltip';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { LOGIN_DATA } from '../services/AuthService';

const Login = () => {

    const [open, setOpen] = React.useState(false)

    const handleTooltipClose = () => {
        setOpen(false);
      };
    
    const handleTooltipOpen = () => {
        setOpen(true);
    };

    return (
        <div className="wrapper">
            <Header />
            <Container className="auth-container">
                <AuthForm />

                <div className="help-block">
                    <ClickAwayListener onClickAway={handleTooltipClose}>
                        <div>
                            <HtmlTooltip
                                PopperProps={{
                                    disablePortal: true,
                                }}
                                onClose={handleTooltipClose}
                                open={open}
                                disableFocusListener
                                disableHoverListener
                                disableTouchListener
                                title={
                                    <React.Fragment>
                                        {LOGIN_DATA.auth_data.map(data => (
                                        <div className="tooltip-block">
                                            <ul>
                                                <li>
                                                    Логин: <span style={{color: '#a41414'}}>{data.username}</span>  Пароль: <span style={{color: '#a41414'}}>{data.password}</span>
                                                </li>
                                            </ul>
                                        </div>
                                        ))}
                                    </React.Fragment>
                                }
                            >
                            <HelpIcon style={{fontSize: 30}} onClick={handleTooltipOpen}>Click</HelpIcon>
                        </HtmlTooltip>
                    </div>
                    </ClickAwayListener>
                </div>

            </Container>
            <Footer />
        </div>
    )
}

export default Login;