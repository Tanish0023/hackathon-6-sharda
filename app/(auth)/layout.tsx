import Navbar from "./_components/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div >
        <Navbar />
        <div className="m-10">

        {children}
        </div>
    </div>
  );
}
