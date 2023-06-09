import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-vista-festival',
  templateUrl: './vista-festival.component.html',
  styleUrls: ['./vista-festival.component.scss']
})
export class VistaFestivalComponent implements AfterViewInit {

  ngAfterViewInit() {
    this.chargeInfo();
  }

  /**
   * Función para cargar la información del festival en la vista.
   */
  async chargeInfo() {
    let ya_mostrados: String[] = [];
    let id_festival = localStorage.getItem('IDFestival');
    const URL = "https://hotspotbackend-production.up.railway.app/festivales/" + id_festival;

    const response = await fetch(URL
    ).then(response => {
      if (response.status === 200) {
        return response.json();
      }
      return "error"
    }).then(data => {
      let festi = data;
      let foto = document.getElementById('foto');
      let nombre = document.getElementById('nombre');
      let ubicacion = document.getElementById('ubicacion');
      let desc = document.getElementById('desc');

      if (foto && nombre && ubicacion && desc) {
        (foto as HTMLImageElement).src = festi.foto;
        (foto as HTMLImageElement).style.borderRadius = '30px';
        nombre.innerHTML = festi.nombre;
        ubicacion.innerHTML = festi.localizacion;
        desc.innerHTML = festi.descripcion;
        let artistas = data.artistas;
        let enlaces = document.getElementsByClassName('enlaces');
        let fotos = [];
        fotos.push(document.getElementById('img1'));
        fotos.push(document.getElementById('img2'));
        fotos.push(document.getElementById('img3'));
        fotos.push(document.getElementById('img4'));
        let artistas2 = fotos;
        this.Megustas_Status(data._id);
        let iconos = document.getElementsByClassName('flechas');
        let contador = 0;
        let save = 0;

        if (artistas.length < 1) {

          for (let i = 0; i < enlaces.length; i++) {
            const element = enlaces[i];
            element.innerHTML = "";
          }
          iconos[0].className = "";
          iconos[0].className = "";
          let aviso = document.createElement('b');
          aviso.innerHTML = 'No hay artistas contratados para este festival aún.';
          document.getElementById('artista_lista')?.appendChild(aviso);

        } else {

          for (let i = 0; i < enlaces.length; i++) {

            if (i < artistas.length) {

              const URL = "https://hotspotbackend-production.up.railway.app/artistas/" + artistas[i];

              const response = fetch(URL
              ).then(response => {
                if (response.status === 200) {
                  return response.json();
                }
                return "error"
              }).then(data => {
                enlaces[contador].setAttribute('name', data._id);
                (artistas2[contador] as HTMLImageElement).src = data.foto;
                enlaces[contador].setAttribute('href', 'vista-artista');
                ya_mostrados.push(artistas[i]);
                contador++;

              })
                .catch(error => {
                  console.error("Error getting fest data:", error);
                });

            } else {

              enlaces[i].innerHTML = "";

            }
            contador++;

            if (contador == 4) {
              save = i;
              contador = 0;
              break;
            };

          }


          let izq = iconos[0];
          let der = iconos[1];

          izq.addEventListener('click', function prev() {

            window.location.href = 'vista-festival';
          });

          der.addEventListener('click', function next() {

            let contador2 = 0;
            let img1 = document.getElementById('img1');
            let enl1 = document.getElementById('enl1');
            let enl2 = document.getElementById('enl2');
            let enl3 = document.getElementById('enl3');
            let enl4 = document.getElementById('enl4');
            let img2 = document.getElementById('img2');
            let img3 = document.getElementById('img3');
            let img4 = document.getElementById('img4');
            if (img1 && img2 && img3 && img4 && enl1 && enl2 && enl3 && enl4) {
              (img1 as HTMLImageElement).style.opacity = '0';
              (img2 as HTMLImageElement).style.opacity = '0';
              (img3 as HTMLImageElement).style.opacity = '0';
              (img4 as HTMLImageElement).style.opacity = '0';
              enl1.style.pointerEvents = 'none';
              enl2.style.pointerEvents = 'none';
              enl3.style.pointerEvents = 'none';
              enl4.style.pointerEvents = 'none';
            }


            for (let i = 0; i < artistas.length && contador2 < 4; i++) {
              if (i < artistas.length) {
                const URL = "https://hotspotbackend-production.up.railway.app/artistas/" + artistas[i];

                const response = fetch(URL
                ).then(response => {
                  if (response.status === 200) {
                    return response.json();
                  }
                  return "error"
                }).then(data => {

                  let verify = ya_mostrados.indexOf(artistas[i]);

                  if (verify < 0) {

                    const URL = "https://hotspotbackend-production.up.railway.app/artistas/" + artistas[i];

                    const response = fetch(URL
                    ).then(response => {
                      if (response.status === 200) {
                        return response.json();
                      }
                      return "error"
                    }).then(data => {
                      (enlaces[contador2] as HTMLElement).style.pointerEvents = 'auto';
                      enlaces[contador2].setAttribute('name', data._id);
                      (artistas2[contador2] as HTMLImageElement).src = data.foto;
                      (artistas2[contador2] as HTMLImageElement).style.opacity = '1';
                      enlaces[contador2].setAttribute('href', 'vista-artista');
                      ya_mostrados.push(artistas[i]);
                      contador2++;
                      save = i;
                    })
                      .catch(error => {
                        console.error("Error getting fest data:", error);
                      });
                  }
                })
                  .catch(error => {
                    console.error("Error getting fest data:", error);
                  });

              }
            }

          }
          );
        }
      }

      this.Guardian();

    })
      .catch(error => {
        console.error("Error getting fest data:", error);
      });
  };

    /**
     * Función que guarda el ID del festival en el localStorage.
     */
  async Guardian() {
    let enlaces = document.getElementsByClassName('enlaces');

    for (let i = 0; i < enlaces.length; i++) {
      let element = enlaces[i]

      element?.addEventListener('click', function (evt) {
        let nombre = (evt.currentTarget as HTMLElement).getAttribute("name") || "No se ha podido cargar";
        localStorage.setItem('IDArtista', nombre);
      })
    }
  };

  /**
  * Función que sirve para comprobar si el artista se encuentra entre los favoritos del usuario.
  * @param id_festival
  */
  async Megustas_Status(id_festival: String) {
    let estado = document.getElementById('estado_megusta');
    let guardado = false;
    let email_usuario = localStorage.getItem('email');
    let posicion = 0;

    const URL = "https://hotspotbackend-production.up.railway.app/users/email/" + email_usuario;

    const response = await fetch(URL
    ).then(response => {
      if (response.status === 200) {
        return response.json();
      }
      return "error"
    }).then(data => {

      if (data[0].favFests.length > 0) {
        for (let i = 0; i < data[0].favFests.length; i++) {
          const element = data[0].favFests[i];
          if (element == id_festival && estado) {
            guardado = true;
            posicion = i;
          }
        }
      }

      if (!guardado && estado && localStorage.getItem('tipo') != 'admin') {
        estado.className = "bi bi-heart";
        estado.addEventListener("click", async function (evt) {
          (evt.currentTarget as HTMLElement).className = "bi bi-heart-fill";
          let festis = data[0].favFests;
          festis.push(localStorage.getItem('IDFestival'));

          let URL = 'https://hotspotbackend-production.up.railway.app/users/' + data[0]._id;
          const response = await fetch(URL, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ password: data[0].password, nombre: data[0].nombre, email: data[0].email, fechanacimiento: data[0].fechanacimiento, followed: data[0].followed, favArts: data[0].favArts, favFests: festis, foto: data[0].foto, tipo: data[0].tipo })
          }).then(response => {
            if (response.status === 200) {
              window.location.reload();
            } else {
              console.log('Error añadiendo el festival')
            }
          }).catch(error => {
            console.error("Error adding a fest:", error);
          });

        })
      } else if (guardado && estado && localStorage.getItem('tipo') != 'admin') {
        estado.className = "bi bi-heart-fill";
        estado.addEventListener("click", async function (evt) {
          (evt.currentTarget as HTMLElement).className = "bi bi-heart";
          let festis = data[0].favFests;
          festis.splice(posicion, 1);

          let URL = 'https://hotspotbackend-production.up.railway.app/users/' + data[0]._id;
          const response = await fetch(URL, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ password: data[0].password, nombre: data[0].nombre, email: data[0].email, fechanacimiento: data[0].fechanacimiento, followed: data[0].followed, favArts: data[0].favArts, favFests: festis, foto: data[0].foto, tipo: data[0].tipo })
          }).then(response => {
            if (response.status === 200) {
              window.location.reload();
            } else {
              console.log('Error eliminando el festival')
            }
          }).catch(error => {
            console.error("Error deleting a fest:", error);
          });
        })
      }

    })
      .catch(error => {
        console.error("Error getting fest data:", error);
      });

  }

}
