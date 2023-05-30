import { AfterViewInit,Component } from '@angular/core';
import { Festival } from '../festival.model';

@Component({
  selector: 'app-form-peticion',
  templateUrl: './form-peticion.component.html',
  styleUrls: ['./form-peticion.component.scss']
})
export class FormPeticionComponent implements AfterViewInit{
  ngAfterViewInit(): void {
    this.RolCheckBusiness();
  }

  festival: Festival = this.newFestival();

  newFestival() {
    return new Festival('', '', new Date(), '', '', false, false, false, [], false, 0, '');
  }


  async registerFestival() {

    let idempresa = localStorage.getItem('email')
    const URL = "http://localhost:5000/empresas/email/" + idempresa;
    const response = await fetch(URL
    ).then(response => {
      if (response.status === 200) {
        return response.json();
      }
      return "error"
    }).then(data => {
      let id_empresa = data[0]._id;
      let tipo_peticion = localStorage.getItem('clase');
      let bonus1 = false;
      let bonus2 = false;
      if (tipo_peticion == 'Pro') { bonus1 = true }
      else if (tipo_peticion == 'Business') { bonus2 = true };


      const URL = "http://localhost:5000/festivales";
      const response = fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ Id_empresa: id_empresa, nombre: this.festival.nombre, fecha: this.festival.fecha, localizacion: this.festival.localizacion, descripcion: this.festival.descripcion, mayoriaedad: this.festival.mayoriaedad, eshot: bonus1, esnovedad: bonus2, artistas: [], confirmado: false, megustas: 0, foto: this.festival.foto })
      }).then(async response => {
        if (response.status === 200) {
          this.guardarID();
        } else {
          alert('Algo ha salido mal')
          console.log('error')
        }

      }).catch(error => {
        console.error("Error creando el festival:", error);
      });

    })
      .catch(error => {
        console.error("Error getting fest data:", error);
      });

  }

  async guardarID() {
    const URL = "http://localhost:5000/festivales";

  const response = fetch(URL
  ).then(response => {
    if (response.status === 200) {
      return response.json();
    }
    return "error"
  }).then(data => {
    localStorage.setItem('prev',data[data.length-1]._id);
    localStorage.setItem('clase', '');
    window.location.href = 'addArts'
  })
  .catch(error => {
    console.error("Error getting fest data:", error);
  });
  };

  async Guardian() {
    let enlaces = document.getElementsByClassName('enlaces');

      for (let i = 0; i < enlaces.length; i++) {
        let element = enlaces[i]

        element?.addEventListener('click', function(evt){
          let nombre = (evt.currentTarget as HTMLElement).getAttribute("name") || "No se ha podido cargar";
          localStorage.setItem('IDFestival', nombre);
        })
      }
  };


  async RolCheckBusiness(){
    let rol = localStorage.getItem('soyempresa');
    let logged = localStorage.getItem('loggedUser');

    
    if (logged != 'y' || rol != 'y' || rol == null){
      
      let body = document.getElementsByTagName('body');
      if (body){
      body[0].innerHTML = '';
      body[0].style.width='80%'; 
      body[0].style.height='80%'; 
      body[0].style.margin = 'auto';
      body[0].style.marginTop = '5%';

      
      
      let div = document.createElement('div');
      div.style.display = 'flex';
      div.id = 'container';

      let img = document.createElement('img');
      //Cambiar 'ruta' por la imagen de la guindilla sin color.
      img.src= 'ruta';
      let p = document.createElement('p');
      let h2 = document.createElement('h1');
      h2.innerHTML = '¡Oops! Parece que no tienes acceso para estar aquí.';
      h2.style.color = 'white'
      let h3 = document.createElement('h3');
      h3.style.color = 'white'
      h3.innerHTML = 'Serás redirigid@ a la página de inicio.';

      p.appendChild(h2);
      p.appendChild(h3);
      div.appendChild(img);
      div.appendChild(p);
      body[0].appendChild(div);


      setTimeout(function temporizador(){window.location.href = ''},3000);
    }

    };
  };

}
