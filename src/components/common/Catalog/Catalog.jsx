import { useState, useRef, useEffect } from "react";
import styles from "./Catalog.module.css";
import { Link } from "react-router-dom";

const categories = [
  {
    title: "Figures",
    links: [
      { to: "/nendoroids", label: "Nendoroids" },
      { to: "/animeDolls", label: "Anime dolls" },
      { to: "/forAdults", label: "For Adults (18+)" },
    ],
  },
  {
    title: "Merchandise",
    links: [
      { to: "/keychains", label: "Keychains" },
      { to: "/pins", label: "Pins" },
      { to: "/posters", label: "Posters" },
    ],
  },
  {
    title: "Clothing and Accessories",
    links: [
      { to: "/t-shirts", label: "T-shirts with anime prints" },
      { to: "/bags", label: "Backpacks and bags" },
      { to: "/additionalClothes", label: "Scarves, gloves, and socks" },
    ],
  },
  {
    title: "Manga and Artbooks",
    links: [
      { to: "/manga", label: "Manga" },
      { to: "/artbooks", label: "Anime and manga artbooks" },
      { to: "/posters", label: "Illustrations and posters" },
    ],
  },
  {
    title: "Collectibles",
    links: [
      { to: "/rare", label: "Rare" },
      { to: "/limitedEditionFigures", label: "Limited edition figures" },
      { to: "/autographs", label: "Autographs from creators" },
    ],
  },
];

const Catalog = ({ isOpen, toggleCatalog }) => {
  const [openCategories, setOpenCategories] = useState({});
  const [isMobile] = useState(window.innerWidth <= 768);
  const catalogRef = useRef(null);

  const toggleCategory = (category) => {
    if (isMobile) {
      setOpenCategories((prev) => ({
        ...prev,
        [category]: !prev[category],
      }));
    }
  };

  useEffect(() => {
    // Click handler outside the catalog
    const handleClickOutside = (event) => {
      if (catalogRef.current && !catalogRef.current.contains(event.target)) {
        toggleCatalog(); // Close a catalog when clicking outside of it
      }
    };

    if (isOpen) {
      // If the catalog is open, add a click handler
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      // If the catalog is closed, remove a click handler
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, toggleCatalog]); // Adding isOpen
  return (
    <div
      ref={catalogRef}
      className={`${styles.catalog} ${isOpen ? styles.catalogOpen : ""}`}
    >
      {categories.map((category, index) => (
        <div key={index} className={styles.category}>
          <h3 onClick={() => toggleCategory(category.title)}>
            {category.title}
          </h3>
          {(isMobile && openCategories[category.title]) || !isMobile ? (
            <ul className={openCategories[category.title] ? styles.show : ""}>
              {category.links.map((link, linkIndex) => (
                <Link key={linkIndex} to={link.to}>
                  <li>{link.label}</li>
                </Link>
              ))}
            </ul>
          ) : null}
        </div>
      ))}
      <button className={styles.closeButton} onClick={toggleCatalog}>
        <img
          src="https://png.klev.club/uploads/posts/2024-04/png-klev-club-vmnn-p-belii-krestik-png-20.png"
          alt="Close"
        />
      </button>
    </div>
  );
};

export default Catalog;
