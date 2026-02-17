export function ManifestoSection() {
  return (
    <section className="bg-cyan py-16 sm:py-20 lg:py-28">
      <style>{`
        @keyframes background-pan {
          from { background-position: 0% center; }
          to { background-position: -200% center; }
        }
        .magic-text {
          animation: background-pan 6s linear infinite;
          background: linear-gradient(
            to right,
            #FCCA46,
            #c9a0dc,
            #f4f0ec,
            #FCCA46
          );
          background-size: 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
      <div className="mx-auto max-w-7xl px-8 sm:px-14 lg:px-18">
        <p className="font-avenir font-black text-2xl sm:text-3xl lg:text-5xl uppercase leading-snug tracking-wide">
          <span className="text-raisin">
            Parce que nous sommes convaincus qu&apos;
          </span><span className="magic-text">
            à l&apos;ère des médias et de la communication de masse,
            l&apos;Eglise peut et doit briller par une communication de
            qualité et à la portée de tous.
          </span>
          <br />
          <span className="text-raisin">
            Nous voulons être ces serviteurs qui aident l&apos;Eglise à
            rejoindre le monde pour faire connaître l&apos;Evangile de Jésus.
          </span>
        </p>
      </div>
    </section>
  );
}
