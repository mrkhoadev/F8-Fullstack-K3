// import Navigation from "@/components/Navigation";
export const metadata = {
    title: "Tiêu đề trang",
    description: "Generated by create next app",
};

export default function RootLayout({ children }) {
    return (
        <html lang="vi" suppressHydrationWarning>
            <body>
                <main>{children}</main>
            </body>
        </html>
    );
}
