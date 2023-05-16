import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-vista-festival',
  templateUrl: './vista-festival.component.html',
  styleUrls: ['./vista-festival.component.scss']
})
export class VistaFestivalComponent implements AfterViewInit {

  ngAfterViewInit() {
    this.chargeInfo();
    setTimeout(this.Guardian,100);
  }

  async chargeInfo() {
    let id_festival = localStorage.getItem('IDFestival');
    const URL = "http://localhost:5000/festivales/" + id_festival;

    const response = await fetch(URL
    ).then(response => {
      if (response.status === 200) {
        return response.json();
      }
      return "error"
    }).then(data => {
      let festi = data;
      let nombre = document.getElementById('nombre');
      let ubicacion = document.getElementById('ubicacion');
      let desc = document.getElementById('desc');

      if (nombre && ubicacion && desc) {
        nombre.innerHTML = festi.nombre;
        ubicacion.innerHTML = festi.localizacion;
        desc.innerHTML = festi.descripcion;
        let artistas = data.artistas;
        let enlaces = document.getElementsByClassName('enlaces');
        this.Megustas_Status(data._id);


        if (artistas.length < 1) {

          for (let i = 0; i < enlaces.length; i++) {
            const element = enlaces[i];
            element.innerHTML = "";
          }
          let iconos = document.getElementsByClassName('flechas');
          iconos[0].className = "";
          iconos[0].className = "";
          let aviso = document.createElement('b');
          aviso.innerHTML = 'No hay artistas contratados para este festival aún.';
          document.getElementById('artista_lista')?.appendChild(aviso);

        } else {

          let contador = 0;
          let save = 0;

          for (let i = save; i < enlaces.length; i++) {
            
            if (i < artistas.length) {

              const URL = "http://localhost:5000/artistas/" + artistas[i];

              const response = fetch(URL
              ).then(response => {
                if (response.status === 200) {
                  return response.json();
                }
                return "error"
              }).then(data => {
                enlaces[i].setAttribute('name',data._id);
                enlaces[i].innerHTML = data.foto;
                enlaces[i].setAttribute('href','vista-artista');

              })
                .catch(error => {
                  console.error("Error getting fest data:", error);
                });

            } else {

              enlaces[i].innerHTML = "";

            }

            contador++;

            if (contador == 4) {
              contador = 0;
              save = i;
              break;
            };

          }
        }
      }


      
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
          localStorage.setItem('IDArtista', nombre);
        })
      }
  };

async Megustas_Status(id_festival: String){
  let estado = document.getElementById('estado_megusta');
  let guardado = false;
  let email_usuario = localStorage.getItem('email');
    
    
    const URL = "http://localhost:5000/users/email/"+email_usuario;

    const response = await fetch(URL
    ).then(response => {
      if (response.status === 200) {
        return response.json();
      }
      return "error"
    }).then(data => {
      console.log(data[0]);
      for (let i = 0; i < data[0].favFests.length; i++) {
        const element = data.favFests[i];

        if(element == id_festival && estado){
          guardado = true;
        }
        
      }

      if (guardado && estado){
        estado.className = "bi bi-heart-fill";
        estado.addEventListener("click",function(evt){
          (evt.currentTarget as HTMLElement).className = "bi bi-heart";
          // Aquí va el put o update pa actualizar el bicho
        })
      } else if(!guardado && estado){
        estado.className = "bi bi-heart";
        estado.addEventListener("click",function(evt){
          (evt.currentTarget as HTMLElement).className = "bi bi-heart-fill";
          // Aquí va el put o update pa actualizar el bicho
        })
      }
     
    })
      .catch(error => {
        console.error("Error getting fest data:", error);
      });

}

async change_status(evt: { currentTarget: any; }){

}

}
