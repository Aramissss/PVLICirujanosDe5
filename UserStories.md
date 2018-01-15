#Descripción:
Es un juego arcade de un jugador en el que interpretamos el papel de un doctor que tira pastillas a un frasco con gérmenes. El objetivo es eliminar todos los gérmenes del frasco usando el color de las pastillas.

# Mecánicas del juego original(Vamos a mantenerlas):

* Controlar la pastilla mientras cae, (movimiento, rotación y velocidad).
* Al principio de cada nivel aparecen gérmenes con 3 colores distintos, nunca aparecen más de 2 gérmenes juntos.
* El número de virus de un nivel es el nivel*4+4. El nivel máximo es el 20.
* Cuando 4 colores iguales están adyacentes de forma vertical u horizontal se eliminan, tanto si son píldoras o gérmenes.
* Los gérmenes no caen.
* Se puede escoger la velocidad del juego. (Low, med, high).
* El juego tiene un sistema de puntuación.
* En velocidad baja cada germen destruido te da 100 puntos, en media 200 y en alta 300.
* Hay un marcador que indica la mayor puntuación obtenida.
* La píldora en principio está unida, cuando se separa los bloques funcionan de forma individual.
* En la mano de Mario aparece la próxima píldora que va a aparecer.
* Hay una cifra que te marca el número de virus restantes, el nivel y la velocidad actual.
* Cuando rebasas el límite del frasco pierdes.
* Cuando pierdes Mario hace ¯\_ツ_/¯.
* Cuando matas un virus de un color, el de la lupa reaciona.
* Cuando mueren todos los virus del mismo tipo, su representante en la lupa desaparece.
* Se puede pausar el juego.
* Cuando pierdes aparece Game Over y te lleva al menú de selección de nivel





# Historias de Usuario

~~1. Escena de juego~~
~~2. Escena del menú~~
~~3. Tablero donde se juega~~
~~4. Las píldoras caen con el tiempo~~
~~5. Existen píldoras dobles~~
~~6. Leer input de usuario para mover píldoras y girarlas~~
~~7. Las píldoras colisionan con los limites del tablero y las demás píldoras~~
~~8. Comprobación de que hay 4 colores contiguos en vertical u horizontal~~
~~9. Destrucción de las píldoras individuales~~
~~10. Creación inicial de los virus en el tablero~~
~~11. Los virus suman puntuación al ser destruidos~~
~~12. Cuando las píldoras colisionan en el tablero aparece una siguiente píldora~~
~~13. Hay una píldora que te indica cuál será la siguiente en aparecer~~
~~14. Hay un marcador con la puntuación actual~~
~~15. Si una píldora bloquea la entrada al tablero la partida finaliza~~
~~16. Hay un contador con virus restantes~~
~~17. Cuando no quedan virus la partida finaliza con victoria~~
~~18. Al finalizar un nivel se genera uno nuevo y aumenta el contador de nivel~~
~~19. En el menú se puede seleccionar el nivel~~
~~20. En el menú se puede seleccionar la velocidad~~

# Opcionales

~~1. Implementar el modo 2 jugadores~~
