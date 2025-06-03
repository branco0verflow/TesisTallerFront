

export default function FullScreen({ children, background }) {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      {children}
    </div>
  );
}
