import { Component, OnInit } from '@angular/core';
import { Heroe, Publisher } from '../../interfaces/heroes.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmarComponent } from '../../components/confirmar/confirmar.component';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styleUrls: ['./agregar.component.css']
})
export class AgregarComponent implements OnInit {
  constructor(private heroeService:HeroesService,
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private snackBar:MatSnackBar,
    public dialog:MatDialog){}
  ngOnInit(): void {
    if(!this.router.url.includes('editar')){
      return;
    }
    this.activatedRoute.params
    .pipe(
      switchMap(({id})=> this.heroeService.getHeroePorId(id))
    )
    .subscribe( heroe => this.heroe = heroe)
  }
publishers = [
  {
    id:'DC Comics',
    desc: 'DC-Comics'
  },
  {
    id:'Marvel Comics',
    desc: 'Marvel Comics'
  }
]
heroe:Heroe =
{
superhero:'',
alter_ego:'',
characters:'',
first_appearance:'',
publisher:Publisher.DCComics,
alt_img:''
}

guardar(){
  console.log(this.heroe.id)
  if(this.heroe.superhero.trim().length === 0){
    return;
  }
  if(this.heroe.id){
    //actualizar
    this.heroeService.actualizarHeroe(this.heroe)
    .subscribe(heroe => this.mostrarSnackbar('Registro actualizado'))
  }else{
    //crear
    this.heroeService.agregarHeroe(this.heroe)
  .subscribe(heroe => {
     this.router.navigate(['/heroes/editar',heroe.id]);
     this.mostrarSnackbar('Registro creado')
  })
  }
  
}
borrarHeroe(){

   const dialog = this.dialog.open(ConfirmarComponent,{
    width:'550px',
    data:this.heroe
  });
  dialog.afterClosed().subscribe(
    (result) => {
      if(result){
         this.heroeService.borrarHeroe(this.heroe.id!)
 .subscribe( resp => {
   this.router.navigate(['/heroes']);
 } )
      }
    }
  )

}
mostrarSnackbar(mensaje:string){
  this.snackBar.open(mensaje,'ok!',{
    duration:2500
  })
}
}
