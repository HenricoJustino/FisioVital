<template>
  <div class="sobre-page">
    <section class="sobre-hero">
      <div class="container">
        <h1>Sobre a FisioVital</h1>
        <p>Excelência em fisioterapia e reabilitação</p>
      </div>
    </section>

    <section class="sobre-content">
      <div class="container">
        <div class="sobre-grid">
          <div class="sobre-text">
            <h2>Nossa História</h2>
            <p>A FisioVital nasceu do sonho de oferecer tratamentos fisioterapêuticos de excelência, combinando tecnologia avançada com atendimento humanizado. Desde nossa fundação, temos ajudado milhares de pacientes a recuperarem sua qualidade de vida.</p>
            
            <h2>Nossa Missão</h2>
            <p>Proporcionar tratamentos fisioterapêuticos de alta qualidade, promovendo a recuperação e bem-estar dos nossos pacientes através de técnicas modernas e atendimento personalizado.</p>

            <h2>Nossos Valores</h2>
            <ul>
              <li>Excelência no atendimento</li>
              <li>Compromisso com resultados</li>
              <li>Ética profissional</li>
              <li>Atualização constante</li>
              <li>Respeito ao paciente</li>
            </ul>
          </div>
          <div class="sobre-image">
            <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80" alt="Clínica FisioVital">
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Sobre'
}
</script>

<style scoped>
.sobre-page {
  width: 100%;
}

.sobre-hero {
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
              url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80');
  background-size: cover;
  background-position: center;
  padding: 6rem 2rem;
  text-align: center;
  color: white;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.sobre-hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.sobre-hero p {
  font-size: 1.5rem;
  opacity: 0.9;
}

.sobre-content {
  padding: 4rem 2rem;
  background-color: white;
}

.sobre-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

.sobre-text h2 {
  color: #2c3e50;
  font-size: 2rem;
  margin: 2rem 0 1rem;
}

.sobre-text h2:first-child {
  margin-top: 0;
}

.sobre-text p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.sobre-text ul {
  list-style: none;
  padding: 0;
}

.sobre-text li {
  color: #666;
  padding: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
}

.sobre-text li:before {
  content: "•";
  color: #42b983;
  font-weight: bold;
  position: absolute;
  left: 0;
}

.sobre-image img {
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .sobre-hero {
    padding: 4rem 1rem;
  }

  .sobre-hero h1 {
    font-size: 2.5rem;
  }

  .sobre-hero p {
    font-size: 1.2rem;
  }

  .sobre-content {
    padding: 2rem 1rem;
  }

  .sobre-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .sobre-text h2 {
    font-size: 1.8rem;
  }
}
</style> 