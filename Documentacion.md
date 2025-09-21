<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>


# Custom decorators: 

```@GetUser() user:User```

```@GetUser('id') id:string```

Custon decorator para obtener el user de la request:
Sipasamos la data que queremos de la request @GetUser('id'), solo nos devuelve el 'id', sino devuelve el user completo.

```@Auth(ValidRoles.admin, ValidRoles.user)```

Valida el usuario y los roles 

Para que todo lo referente a AuthModule funcione en otros modulos, se debe importar en cada module donde se quiera validar la ruta