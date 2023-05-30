import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-miespacio',
  templateUrl: './miespacio.component.html',
  styleUrls: ['./miespacio.component.scss']
})
export class MiespacioComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    this.RolCheck();
    this.chargeInfoFestis();
    this.chargeInfoArtists();
  }



  async chargeInfoFestis() {
    let container = document.getElementById('festivales');




    const URL = "http://localhost:5000/users/email/"+localStorage.getItem('email');


    const response = fetch(URL
    ).then(response => {
      if (response.status === 200) {
        return response.json();
      }
      return "error"
    }).then(data => {

      let user = data[0].favFests

      for (let i = 0; i < user.length; i++) {
        
        const id = user[i];
        const URL2 = "http://localhost:5000/festivales/"+id;


        const response = fetch(URL2
        ).then(response => {
          if (response.status === 200) {
            return response.json();
          }
          return "error"
        }).then(data => {

          let a = document.createElement('a');
          a.setAttribute('name',id);
          a.href = 'vista-festival';
          a.className = 'enlaces'
          a.style.marginLeft = '1%'
          a.style.marginRight = '1%'
          a.style.color = 'white'
          
          let card = document.createElement('div');
          card.className = 'card';
          card.style.width = '18rem'
          card.style.color = 'black';
          card.style.background = 'none';
          card.style.border = '1px solid white';
  
          let img = document.createElement('img');
          img.src = data.foto;
  
          let div = document.createElement('div');
          div.className = 'card-body'
  
          let p = document.createElement('p');
          p.className = 'card-text'
          p.innerHTML = data.nombre;
          p.style.color = 'white'
  
          div.appendChild(p);
          card.appendChild(img);
          card.appendChild(div);
          a.appendChild(card);
          container?.appendChild(a);
        }).catch(error => {
          console.error("Error getting fest data:", error);
        });

      }
      this.GuardianFestis();
    })
      .catch(error => {
        console.error("Error getting fest data:", error);
      });

  };

  async chargeInfoArtists() {
    let container = document.getElementById('artistas');

    const URL = "http://localhost:5000/users/email/"+localStorage.getItem('email');


    const response = fetch(URL
    ).then(response => {
      if (response.status === 200) {
        return response.json();
      }
      return "error"
    }).then(data => {

      let user = data[0].favArts
      for (let i = 0; i < user.length; i++) {
        const id = user[i];

        const URL2 = "http://localhost:5000/artistas/"+id;


        const response = fetch(URL2
        ).then(response => {
          if (response.status === 200) {
            return response.json();
          }
          return "error"
        }).then(data => {

        let a = document.createElement('a');
        a.setAttribute('name',id);
        a.href = 'vista-artista';
        a.className = 'enlaces'
        a.style.marginLeft = '1%'
        a.style.marginRight = '1%'
        a.style.color = 'white'

        let card = document.createElement('div');
        card.className = 'card';
        card.style.width = '10rem'
        card.style.color = 'black';
        card.style.background = 'none';
        card.style.border = '1px solid white';

        let img = document.createElement('img');
        img.src = data.foto;

        let div = document.createElement('div');
        div.className = 'card-body'

        let p = document.createElement('p');
        p.className = 'card-text'
        p.innerHTML = data.apodo;
        p.style.color = 'white'


        div.appendChild(p);
        card.appendChild(img);
        card.appendChild(div);
        a.appendChild(card);
        container?.appendChild(a);
      }).catch(error => {
        console.error("Error getting fest data:", error);
      });
      }
      this.GuardianArtists();
    })
      .catch(error => {
        console.error("Error getting fest data:", error);
      });

  };


  async GuardianFestis() {
    let enlaces = document.getElementsByClassName('enlaces');

      for (let i = 0; i < enlaces.length; i++) {
        let element = enlaces[i]

        element?.addEventListener('click', function(evt){
          let nombre = (evt.currentTarget as HTMLElement).getAttribute("name") || "No se ha podido cargar";
          localStorage.setItem('IDFestival', nombre);
        })
      }
  };

  async GuardianArtists() {
    let enlaces = document.getElementsByClassName('enlaces');

      for (let i = 0; i < enlaces.length; i++) {
        let element = enlaces[i]

        element?.addEventListener('click', function(evt){
          let nombre = (evt.currentTarget as HTMLElement).getAttribute("name") || "No se ha podido cargar";
          localStorage.setItem('IDArtista', nombre);
        })
      }
  };

  async RolCheck(){
    let logged = localStorage.getItem('loggedUser');
    let rol = localStorage.getItem('tipo');

    
    if (logged != 'y' || logged == null || rol=='admin'){
      
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