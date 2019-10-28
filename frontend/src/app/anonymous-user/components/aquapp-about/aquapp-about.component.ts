import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-aquapp-about',
  templateUrl: './aquapp-about.component.html',
  styleUrls: ['./aquapp-about.component.scss'],
})
export class AquappAboutComponent implements OnInit {
  features = [
    {
      title: 'aquapp.about.whyAquApp.features.realData.title',
      description: 'aquapp.about.whyAquApp.features.realData.text',
      icon: 'bar_chart',
    },
    {
      title: 'aquapp.about.whyAquApp.features.noRestrictions.title',
      description: 'aquapp.about.whyAquApp.features.noRestrictions.text',
      icon: 'lock_open',
    },
    {
      title: 'aquapp.about.whyAquApp.features.download.title',
      description: 'aquapp.about.whyAquApp.features.download.text',
      icon: 'cloud_download',
    },
    {
      title: 'aquapp.about.whyAquApp.features.crossBrowser.title',
      description: 'aquapp.about.whyAquApp.features.crossBrowser.text',
      icon: 'web',
    },
  ];
  team = [
    {
      name: 'aquapp.about.whyAquApp.team.juan.name',
      role: 'aquapp.about.whyAquApp.team.juan.role',
      info: `aquapp.about.whyAquApp.team.juan.info`,
      photo: 'assets/team/juan-pablo-rodriguez.jpeg',
      photoAlt: 'Foto de Juan Pablo Rodríguez Macías',
    },
    {
      name: 'aquapp.about.whyAquApp.team.victor.name',
      role: 'aquapp.about.whyAquApp.team.victor.role',
      info: `aquapp.about.whyAquApp.team.victor.info`,
      photo: 'assets/team/victor-borja.jpg',
      photoAlt: 'Foto de Víctor Borja Marrugo',
    },
    {
      name: 'aquapp.about.whyAquApp.team.laura.name',
      role: 'aquapp.about.whyAquApp.team.laura.role',
      info: `aquapp.about.whyAquApp.team.laura.info`,
      photo: 'assets/team/laura-schiatti.png',
      photoAlt: 'Foto de Laura Schiatti',
    },
    {
      name: 'aquapp.about.whyAquApp.team.jairo.name',
      role: 'aquapp.about.whyAquApp.team.jairo.role',
      info: `aquapp.about.whyAquApp.team.jairo.info`,
      photo: 'assets/team/jairo-serrano.png',
      photoAlt: 'Foto de Jairo Serrano',
    },
    {
      name: 'aquapp.about.whyAquApp.team.alvaro.name',
      role: 'aquapp.about.whyAquApp.team.alvaro.role',
      info: `aquapp.about.whyAquApp.team.alvaro.info`,
      photo: 'assets/team/alvaro-gonzalez.png',
      photoAlt: 'Foto de Álvaro González',
    },
    {
      name: 'aquapp.about.whyAquApp.team.juancarlos.name',
      role: 'aquapp.about.whyAquApp.team.juancarlos.role',
      info: `aquapp.about.whyAquApp.team.juancarlos.info`,
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
