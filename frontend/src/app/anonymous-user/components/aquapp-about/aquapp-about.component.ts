import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-aquapp-about',
  templateUrl: './aquapp-about.component.html',
  styleUrls: ['./aquapp-about.component.scss'],
})
export class AquappAboutComponent implements OnInit {
  features = [
    {
      title: 'Datos reales',
      description: `La información es recolectada por \
      estudiantes no graduados de la UTB a través de una\
       sonda multi parámetro y muestras de agua.\
        El monitoreo es realizado una vez por semana,\
         y la recolección de algunos de los datos se\
          espera que sea remota (en una segunda etapa del proyecto). `,
      icon: 'bar_chart',
    },
    {
      title: 'Sin restricciones',
      description: `A diferencia de otras instituciones\
       con planes de monitoreo de los cuerpos de agua de\
        Cartagena, los cuales restringen el acceso a la\
         informacióń obtenida, AquApp deja su información\
          disponible para toda la comunidad.`,
      icon: 'lock_open',
    },
    {
      title: 'Descarga',
      description: `Luego de consultar la información, esta\
       puede ser descargada en el formato de texto separado\
        por comas (csv) o como un gráfico. `,
      icon: 'cloud_download',
    },
    {
      title: 'Multi navegador',
      description: `Este sitio fue construído de modo\
       que sea compatible con todos los navegadores\
        modernos (Puedes usarlo en) Chrome, Firefox,\
         Safari y Opera). ¡Siéntete libre de probarlo\
          por ti mismo!. `,
      icon: 'web',
    },
  ];
  team = [
    {
      name: 'Juan Pablo Rodríguez Macías',
      role: 'Desarrollador',
      info: `Estudiante de Ingeniería de Sistemas de
       la Universidad Tecnológica de Bolívar
        y desarrollador web fullstack (NodeJS, MongoDB y
           Angular 8).
           Email: juanpablordmsx2@gmail.com`,
      photo: 'assets/team/juan-pablo-rodriguez.jpeg',
      photoAlt: 'Foto de Juan Pablo Rodríguez Macías',
    },
    {
      name: 'Víctor Borja Marrugo',
      role: 'Monitoreo y recolección de datos',
      info: `Víctor es un estudiante de ingeniería ambiental
       en la universidad Tecnológica de Bolívar.
        Encargado del monitoreo y recolección de
         todas las muestras en el sistema lagunar para
          el análisis de calidad del agua.
        Email: vrmarrugo@gmail.com`,
      photo: 'assets/team/victor-borja.jpg',
      photoAlt: 'Foto de Víctor Borja Marrugo',
    },
    {
      name: 'Laura Schiatti',
      role: 'Desarrolladora',
      info: `Laura es una ingeniera de sistemas
       egresada Summa Cum Laude de la Universidad
        Tecnológica de Bolívar (2017). Gracias a
        su excelente desempeño académico,
        fue merecedora de matrícula de honor
        cada semestre durante sus estudios de
        pregrado, y también fue beneficiaria del
        programa “Becas Iberoamérica. Estudiantes
        de Grado. Santander Universidades” de Banco
        Santander para realizar un intercambio
        académico en el Instituto Tecnológico
        y de Estudios Superiores de Monterrey
        Ciudad de México, MX). Durante su paso por
        la universidad participó en un estudio
        comparativo de diferentes algoritmos de
        clustering para la estimación de grupos
        de evaluados que comparten debilidades
        conceptuales similares. Además se desempeña
        como desarrolladora full-stack con conocimiento
        en tecnologías como HTML5, CSS3, JavaScript,
        Laravel 5.0+, MySQL, MongoDB, Django entre otras,
        lo que le ha permitido ser coautora de RaosAPI
        para el control de asistencia de estudiantes a
        clase, así como de las plataformas AquApp y AquApp 2.0.
        en conjunto con la universidad. Actualmente realiza
        una maestría en Ciencias de la Computación e Ingeniería
        en el Politécnico de Milán, Italia, con énfasis en
        Inteligencia Artificial.

      Email: lauricdd@gmail.com `,
      photo: 'assets/team/laura-schiatti.png',
      photoAlt: 'Foto de Laura Schiatti',
    },
    {
      name: 'Jairo Serrano',
      role: 'Investigador',
      info: `Jairo Serrano, Ingeniero de sistemas (2006)
      de la Universidad Tecnológica de Bolívar (UTB),
      Magíster en Software Libre de la UOC con énfasis en
      desarrollo de software (2008). Se desempeñó como
      coordinador de tecnologías de la dirección de
      educación virtual de la UTB (2001-2010) y profesor
      de tiempo completo de la Facultad de estudios técnicos
      y tecnológicos (2011-2013), actualmente director de
      programa de Ingeniería de Sistemas de la facultad de
      Ingeniería.
      Email: jserrano@utb.edu.co`,
      photo: 'assets/team/jairo-serrano.png',
      photoAlt: 'Foto de Jairo Serrano',
    },
    {
      name: 'Álvaro González',
      role: 'Investigador',
      info: ` Civil engineer (University of Cartagena),
      Master of Science Civil Engineering with emphasis
      in Environmental Engineering (University of Los Andes),
      Master of Philosophy Civil Engineering with emphasis in
      Water Resources (The City College of New York),
      PhD Civil Engineering with emphasis in Water Resources
      and Environmental Engineering (The City College of New
        York). More than 17 years of experience in consulting,
        research and teaching either in the United States and
        Colombia. Certified Professional in Erosion and
        Sediment Control (CPESC).

      Email: agonzalez7@gmail.com `,
      photo: 'assets/team/alvaro-gonzalez.png',
      photoAlt: 'Foto de Álvaro González',
    },
    {
      name: 'Juan Carlos Martínez',
      role: 'Investigador',
      info: `Juan Carlos es ingeniero Electrónico
      y magíster en Potencia Eléctrica de la
      Universidad Industrial de Santander. Doctor
      de la Universidad de Northeastern, Boston.
      Becario Fulbright‐DNP‐Colciencias 2007. Ha
      sido investigador y docente en la Universidad
      Tecnológica de Bolívar desde el 2004. Obtuvo
      la categoría de Docente Titular en 2017. Su
      trabajo de investigación se ha centrado en
      arquitectura y organización de computadores.
      Las principales áreas de aplicación de sus
      proyectos incluyen: soporte hardware para
      mejoras en la seguridad informática, arquitecturas
      con múltiples núcleos y múltiples procesadores,
      y técnicas avanzadas de diseño digital
      (lenguajes de descripción de hardware, módulos de propiedad
        intelectual, sistemas programables, sistemas
        embebidos, y co‐diseño hardware/software).
        Desde el 2012 dirige un grupo de trabajo
        interdisciplinario con eje central las TIC.
        Docente de la Facultad de Ingenierías donde
        tiene a cargo los cursos de Arquitectura y
        Ensamblador (Ing. Sistemas), Microprocesadores
        (Ing. Electrónica), Microcontroladores (Ing. Mecatrónica),
        y Técnicas Avanzadas de Diseño Digital
        (Maestría en Ingenierías, énfasis Ing.
          Electrónica). Actualmente se encuentra
          en Licencia de Investigación en Ormuco
          Inc. (Montreal, CA).

      Email: jcmartinezs@utb.edu.co `,
      photo: 'assets/team/juan-carlos-martinez.png',
      photoAlt: 'Foto de Juan Carlos Martínez',
    },
  ];
  width = window.innerWidth;
  constructor() {
    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      console.log(this.width);
    });
  }

  ngOnInit() {}
}
