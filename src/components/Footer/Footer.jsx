import React from 'react';
import { Instagram, Facebook, Linkedin, Twitter } from 'lucide-react';
import { Button } from "../ui/button";
import styles from "./footer.module.css";

const Footer = () => {
  return (
    <footer className="bg-orange-400 text-black py-6">
        <div className="container mx-auto px-4">
            {/* Top section: Social media & Contact Us button */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-6 items-center">
                    <span className="text-lg font-semibold">Follow Us On:</span>
                    <Instagram className="text-xl" />
                    <Facebook className="text-xl" />
                    <Linkedin className="text-xl" />
                    <Twitter className="text-xl" />
                </div>
                <Button className={styles.test1} variant="outline" size="sm">
                    Contact Us
                </Button>
            </div>
            {/* Navigation Links */}
            <nav className="flex flex-wrap justify-center space-x-6 mb-4">
                <a href="#" className="hover:underline">Team</a>
                <a href="#" className="hover:underline">FAQs</a>
                <a href="#" className="hover:underline">Blogs/Articles</a>
                <a href="#" className="hover:underline">Terms of Service</a>
                <a href="#" className="hover:underline">Privacy Policy</a>
                <a href="#" className="hover:underline">Feedback</a>
            </nav>
            {/* Footer Bottom: Copyright */}
            <p className="text-center text-sm">&copy; 2024 MakeYumMeal. All rights reserved.</p>
        </div>
    </footer>
  );
};

export default Footer;
