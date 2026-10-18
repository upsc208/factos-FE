import Header from "@/components/Header";

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 
        Header components requires a clubId to show club-specific theme, 
        but it has fallbacks for when it's not provided or invalid.
      */}
      <Header />
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
}
