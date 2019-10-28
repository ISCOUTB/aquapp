import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-aquapp-about',
  templateUrl: './aquapp-about.component.html',
  styleUrls: ['./aquapp-about.component.scss'],
})
export class AquappAboutComponent implements OnInit {
  features = [
    {
      title: 'about.whyAquApp.features.realData.title',
      description: 'about.whyAquApp.features.realData.text',
      icon: 'bar_chart',
    },
    {
      title: 'about.whyAquApp.features.noRestrictions.title',
      description: 'about.whyAquApp.features.noRestrictions.text',
      icon: 'lock_open',
    },
    {
      title: 'about.whyAquApp.features.download.title',
      description: 'about.whyAquApp.features.download.text',
      icon: 'cloud_download',
    },
    {
      title: 'about.whyAquApp.features.crossBrowser.title',
      description: 'about.whyAquApp.features.crossBrowser.text',
      icon: 'web',
    },
  ];
  team = [
    {
      name: 'about.whyAquApp.team.juan.name',
      role: 'about.whyAquApp.team.juan.role',
      info: `about.whyAquApp.team.juan.info`,
      photo: 'assets/team/juan-pablo-rodriguez.jpeg',
      photoAlt: 'Foto de Juan Pablo Rodríguez Macías',
    },
    {
      name: 'about.whyAquApp.team.victor.name',
      role: 'about.whyAquApp.team.victor.role',
      info: `about.whyAquApp.team.victor.info`,
      photo: 'assets/team/victor-borja.jpg',
      photoAlt: 'Foto de Víctor Borja Marrugo',
    },
    {
      name: 'about.whyAquApp.team.laura.name',
      role: 'about.whyAquApp.team.laura.role',
      info: `about.whyAquApp.team.laura.info`,
      photo: 'assets/team/laura-schiatti.png',
      photoAlt: 'Foto de Laura Schiatti',
    },
    {
      name: 'about.whyAquApp.team.jairo.name',
      role: 'about.whyAquApp.team.jairo.role',
      info: `about.whyAquApp.team.jairo.info`,
      photo: 'assets/team/jairo-serrano.png',
      photoAlt: 'Foto de Jairo Serrano',
    },
    {
      name: 'about.whyAquApp.team.alvaro.name',
      role: 'about.whyAquApp.team.alvaro.role',
      info: `about.whyAquApp.team.alvaro.info`,
      photo: 'assets/team/alvaro-gonzalez.png',
      photoAlt: 'Foto de Álvaro González',
    },
    {
      name: 'about.whyAquApp.team.juancarlos.name',
      role: 'about.whyAquApp.team.juancarlos.role',
      info: `about.whyAquApp.team.juancarlos.info`,
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
