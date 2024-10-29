// src/components/Navbar/index.jsx
import React from 'react';
import { Instagram, Facebook, Linkedin, Twitter } from 'lucide-react';
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent } from "../ui/card"
import styles from "./footer.css";
//import styles from "./styles.module.css";

const Footer = () => {
  return (
    <footer className="bg-orange-400 text-white">
        <div className="container mx-auto px-4 py-8" style={{padding: 0 + 'rem'}}>
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-4">
              <span>Follow Us on:</span>
              <Instagram />
              <Facebook />
              <Linkedin />
              <Twitter />
            </div>
            <Button variant="outline" className={styles.contact} >Contact Us</Button>
          </div>
          <nav className="flex space-x-4 mb-4">
            <a href="#" className="hover:underline">Team</a>
            <a href="#" className="hover:underline">FAQs</a>
            <a href="#" className="hover:underline">Blogs/Articles</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Feedback</a>
          </nav>
          <p className="text-sm">&copy; 2024 MakeYumMeal. All rights reserved.</p>
        </div>
      </footer>
  );
};

export default Footer;
