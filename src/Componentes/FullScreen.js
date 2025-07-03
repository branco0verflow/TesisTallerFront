

export default function FullScreen({ children, background }) {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-start justify-center pt-8 px-4"
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      <div className="w-full max-w-4xl">
        {children}
      </div>
    </div>
  );
}

