import "../styles/globals.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export const metadata = {
    title: "Phure Studios",
    description: "Indie game studio site",
};

export default function RootLayout({ children }) {
    return (
        <html lang="nl">
            <body>
                <Navbar />
                <main className="container section">{children}</main>
                <Footer />
            </body>
        </html>
    );
}