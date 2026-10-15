import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class Pokemon {
    private http = inject(HttpClient); //reference to the HttpClient library
    private apiUrl = 'http://localhost:5000/api/pokemon'; //API endpoint for the backend server

    //Reactive State Management using Signals
    public pokemonList = signal<any[]>([]); //Signal to hold the list of Pokemon
    

    fetchPokemonList() {
        this.http.get<any[]>(this.apiUrl).subscribe((data) => {
            this.pokemonList.set(data);
        });
    }

    //This saves our data to the database
    savePokemon(data: any) {
        return this.http.post(this.apiUrl, data)
    }

}
