"use client";

import { useState } from 'react';
import { createTheme, ThemeProvider, responsiveFontSizes } from "@mui/material/styles";
import styles from '@/styles/report.module.css';

import NextLink from 'next/link';
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";

let theme = createTheme({
    palette: {
      suncorpgreen: {
        main: "#009877",
        contrastText: "#ffffff",
      },
    }
  });
  
  theme = responsiveFontSizes(theme, {
      factors: {
        'xs': 0.2,
        'sm': 0.2,
        'md': 0.2,
        'lg': 1,
        'xl': 1,
      }
  });

const Report = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Issue Reported:", { title, body });
        alert("Issue reported! We'll get back to you soon.");
    }

    return (
    <ThemeProvider theme={theme}>
        <div className={styles.container} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
            <div className={styles.description}>
                <h1 className={styles.title}>Report an Issue</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <div className={styles.label} style={{ fontSize: '1rem' }}>
                    Issue Title:
                    <input className={styles.input} type="text" value={title} onChange={(e) => setTitle(e.target.value)} required 
                           style={{ fontSize: '1rem', padding: '0.5rem' }}/>
                </div>
                <div className={styles.label} style={{ fontSize: '1.2rem' }}>
                    Description:
                    <textarea 
                        className={styles.textarea} 
                        value={body} 
                        onChange={(e) => setBody(e.target.value)} 
                        required 
                        rows="10"
                        style={{ fontSize: '1rem', padding: '0.5rem' }}
                    />
                </div>
                <NextLink href={`/courses/`} passHref>
                        <Link>
                          <Button variant="contained" color="suncorpgreen" className={styles.buttons}>
                            submit
                          </Button>
                        </Link>
                </NextLink>
            </form>
        </div>
    </ThemeProvider>
    );
}

export default Report;