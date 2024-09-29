import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.receiveEmailsForm}>
        <p>DO YOU WANT TO RECEIVE NOTIFICATIONS ABOUT OUR NEWS AND MORE?</p>
        <input type="text" placeholder="Your email"></input>
        <button>Submit</button>
      </div>
      <div className={styles.additionalInfo}>
        <div>
          <h3>EXPLORE</h3>
          <ul>
            <li>New Collection</li>
            <li>Best Sellings</li>
            <li>Sale</li>
            <li>About Us</li>
          </ul>
        </div>
        <div>
          <h3>CONTACTS</h3>
          <ul>
            <li>+380955776137</li>
            <li>+420723239477</li>
            <li>127788127788a@gmail.com</li>
            <li>halkian1@uhk.cz</li>
          </ul>
        </div>
        <div>
          <h3>SOCIAL</h3>
          <ul>
            <li>Telegram</li>
            <li>X (Twitter)</li>
            <li>Instagram</li>
            <li>YouTube</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
