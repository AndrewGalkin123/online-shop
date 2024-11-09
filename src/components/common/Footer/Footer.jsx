import { useState } from "react";
import styles from "./Footer.module.css";
import { Link } from "react-router-dom";

const Footer = () => {
  const [email, setEmail] = useState("");

  const exploreLinks = [
    { to: "/newCollection", label: "New Collection" },
    { to: "/bestSellings", label: "Best Sellings" },
    { to: "/sale", label: "Sale" },
    { to: "/aboutUs", label: "About Us" },
  ];

  const socialLinks = [
    { href: "https://web.telegram.org/a/#1066918561", label: "Telegram" },
    { href: "https://github.com/AndrewGalkin123", label: "GitHub" },
    {
      href: "https://www.instagram.com/remnantabuzer/profilecard/?igsh=c2drczFpbGh1bXpm",
      label: "Instagram",
    },
    { href: "https://www.youtube.com/@CodeCraft100", label: "YouTube" },
  ];

  const contactLinks = [
    { href: "tel:+380955776137", label: "+380955776137" },
    { href: "tel:+420723239477", label: "+420723239477" },
    {
      href: "mailto:127788127788a@gmail.com",
      label: "127788127788a@gmail.com",
    },
    { href: "mailto:halkian1@uhk.cz", label: "halkian1@uhk.cz" },
  ];

  const handleEmailSubmit = () => setEmail("");

  return (
    <footer className={styles.footer}>
      <div className={styles.receiveEmailsForm}>
        <p>DO YOU WANT TO RECEIVE NOTIFICATIONS ABOUT OUR NEWS AND MORE?</p>
        <div className={styles.submitForm}>
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email input"
          />
          <button onClick={handleEmailSubmit} aria-label="Submit email">
            Submit
          </button>
        </div>
      </div>
      <div className={styles.additionalInfo}>
        <div>
          <h3>EXPLORE</h3>
          <ul onClick={() => window.scrollTo(0, 0)}>
            {exploreLinks.map((link, index) => (
              <li key={index}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>SOCIAL</h3>
          <ul>
            {socialLinks.map((link, index) => (
              <li key={index}>
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>CONTACTS</h3>
          <ul>
            {contactLinks.map((link, index) => (
              <li key={index}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
