import { Typography } from '@material-ui/core'
import React from 'react'

const Footer = () => {
    return (
        <>
            <footer className="footer">
                <Typography
                    align="center"
                    className="footer__text"
                >
                    ©2020 Simple footer | Created by <a
                       className="footer__text--link"
                       href="https://vk.com/andrey_fefilov"
                       target="_blank">
                       Andrey Fefilov
                    </a>
                </Typography>
            </footer>
        </>
    )
}

export default Footer;