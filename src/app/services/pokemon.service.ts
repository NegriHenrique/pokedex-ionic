import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  baseUrl = 'https://pokeapi.co/api/v2';
  imageUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

  constructor(private http: HttpClient) {

  }

  getPokemon(offset = 0) {
    return this.http.get(`${this.baseUrl}/pokemon?offset=${offset}&limit=25`).pipe(
      map(result => {
        return result['results'];
      }),
      map(pokemon => {
        return pokemon.map((poke, index) => {
          poke.image = this.getPokemonImage(index + offset + 1);
          poke.pokeIndex = offset + index + 1;
          return poke;
        })
      })
    );
  }

  getPokemonImage(index) {
    return `${this.imageUrl}/${index}.png`
  }

  findPokemon(search) {
    return this.http.get(`${this.baseUrl}/pokemon/${search}`).pipe(
      map(pokemon => {
        pokemon['image'] = this.getPokemonImage(pokemon['id']);
        pokemon['pokeIndex'] = pokemon['id'];
        return pokemon
      })
    )
  }

  getPokemonDetail(index) {
    return this.http.get(`${this.baseUrl}/pokemon/${index}`).pipe(
      map(pokemon => {
        let sprites = Object.keys(pokemon['sprites'])
        pokemon['images'] = sprites
          .map(spriteKey => {
            if (typeof (pokemon['sprites'][spriteKey]) == 'string') {
              return pokemon['sprites'][spriteKey];
            } 
          })
          .filter(img => img)
        return pokemon
      })
    )
  }
}
