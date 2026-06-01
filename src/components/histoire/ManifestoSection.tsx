export function ManifestoSection() {
  return (
    <section className="bg-cyan py-16 sm:py-20 lg:py-28">
      <style>{`
        @keyframes background-pan {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
        .magic-paragraph {
          animation: background-pan 60s linear infinite;
          background: linear-gradient(
            135deg,
            #FCCA46, #c9a0dc, #f4f0ec, #c9a0dc,
            #FCCA46, #c9a0dc, #f4f0ec, #c9a0dc,
            #FCCA46, #c9a0dc, #f4f0ec, #c9a0dc,
            #FCCA46, #c9a0dc, #f4f0ec, #c9a0dc,
            #FCCA46, #c9a0dc, #f4f0ec, #c9a0dc,
            #FCCA46, #c9a0dc, #f4f0ec, #c9a0dc,
            #FCCA46, #c9a0dc, #f4f0ec, #c9a0dc,
            #FCCA46
          );
          background-size: 1200% 1200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .magic-paragraph .solid-raisin {
          -webkit-text-fill-color: #1e2952;
        }
      `}</style>
      <div className="mx-auto max-w-7xl px-8 sm:px-14 lg:px-18">
        <p className="magic-paragraph font-avenir font-black text-2xl sm:text-3xl lg:text-5xl uppercase leading-snug tracking-wide">
          <span className="solid-raisin">Parce que nous sommes convaincus qu&apos;</span>
          à l&apos;ère des médias et de la communication de masse, l&apos;Eglise peut et doit
          briller par une communication de qualité et à la portée de tous.
          <br />
          <span className="solid-raisin">Nous voulons être ces serviteurs qui </span>
          aident l&apos;Eglise à rejoindre le monde pour faire connaître l&apos;Evangile de Jésus.
        </p>
      </div>
    </section>
  );
}
