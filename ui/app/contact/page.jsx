"use client";

import styles from '@/styles/contact.module.css';

const Contact = () => {
    return (
        <div className={styles.container}>
            <h1>Contact Us</h1>
            <p>You can contact us via the following methods:</p>
            <ul className={styles.list}>
                <li className={styles.listItem}>Email: <a href="mailto:example@suncorp.com">example@suncorp.com</a></li>
                <li className={styles.listItem}>Phone: <a href="tel:1300123456">1300 123 456</a></li>
                <li className={styles.listItem}>Address: 123 Suncorp Street, Brisbane QLD 4000</li>
            </ul>
        </div>
    );
}

export default Contact;
