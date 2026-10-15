import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface PokemonEntry {
    _id: string;
    name: string;
    type: string;
    level: number;
    nature: string;
}

export type PokemonInput = Omit<PokemonEntry, '_id'>;

@Injectable({
    providedIn: 'root'
})
export class Pokemon {
    private http = inject(HttpClient); //reference to the HttpClient library
    private apiUrl = 'http://localhost:5000/api/pokemon'; //API endpoint for the backend server

    //Reactive State Management using Signals
    public pokemonList = signal<PokemonEntry[]>([]); //Signal to hold the list of Pokemon
    

    fetchPokemonList() {
        this.http.get<PokemonEntry[]>(this.apiUrl).subscribe((data) => {
            this.pokemonList.set(data);
        });
    }

    //This saves our data to the database
    savePokemon(data: PokemonInput) {
        return this.http.post<PokemonEntry>(this.apiUrl, data);
    }

    updatePokemon(id: string, data: PokemonInput) {
        return this.http.put<PokemonEntry>(`${this.apiUrl}/${id}`, data);
    }

    deletePokemon(id: string) {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

}
