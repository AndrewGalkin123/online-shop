import styles from "./Footer.module.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.receiveEmailsForm}>
        <p>DO YOU WANT TO RECEIVE NOTIFICATIONS ABOUT OUR NEWS AND MORE?</p>
        <div className={styles.submitForm}>
          <input id="emailInput" type="email" placeholder="Your email"></input>
          <button
            onClick={() => {
              document.getElementById("emailInput").value = "";
            }}
          >
            Submit
          </button>
        </div>
      </div>
      <div className={styles.additionalInfo}>
        <div>
          <h3>EXPLORE</h3>
          <ul>
            <li>
              <Link to="/newCollection">New Collection</Link>
            </li>
            <li>
              <Link to="/bestSellings">Best Sellings</Link>
            </li>
            <li>
              <Link to="/sale">Sale</Link>
            </li>
            <li>
              <Link to="/aboutUs">About Us</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3>SOCIAL</h3>
          <ul>
            <li>
              <Link to="">Telegram</Link>
            </li>
            <li>
              <Link to="">X (Twitter)</Link>)
            </li>
            <li>
              <Link to="">Instagram</Link>
            </li>
            <li>
              <Link to="https://www.youtube.com/@CodeCraft100">YouTube</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3>CONTACTS</h3>
          <ul>
            <li>
              <Link to="">+380955776137</Link>
            </li>
            <li>
              <Link to="">+420723239477</Link>
            </li>
            <li>
              <Link to="">127788127788a@gmail.com</Link>
            </li>
            <li>
              <Link to="">halkian1@uhk.cz</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
