const AboutSection = () => {
  return (
    <section className="about">
      <div className="about-content">
        <div className="about-text">
          <h2>Sobre o Projeto</h2>
          <p>
            O Santo Restauro é uma iniciativa que visa automatizar e padronizar a
            catalogação e administração dos estoques de museus. Com foco na digitalização e 
            na eficiência, substituímos planilhas manuais por uma plataforma intuitiva, segura 
            e adaptável a diferentes instituições.
          </p>
        </div>
        <div className="about-image">
          <img src="..\public\museu.png" />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
