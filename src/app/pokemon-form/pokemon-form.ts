import { ChangeDetectionStrategy,Component,inject,signal,OnInit } from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Pokemon, PokemonEntry} from '../pokemon';

@Component({
  imports: [ ReactiveFormsModule],
  selector: 'app-pokemon-form',
  styleUrl: './pokemon-form.css',
  templateUrl: './pokemon-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PokemonForm implements OnInit {
  
  private formBuilder = inject(FormBuilder);
  pokemonService = inject(Pokemon);
  editingPokemonId: string | null = null;

  pokemonForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    type: ['', Validators.required],
    level: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
    nature: ['', Validators.required]
  });

  ngOnInit() {
    this.pokemonService.fetchPokemonList();
  }

  onSubmit()  {
    if (this.pokemonForm.invalid) return;

    const data = this.pokemonForm.getRawValue();
    const request = this.editingPokemonId
      ? this.pokemonService.updatePokemon(this.editingPokemonId, data)
      : this.pokemonService.savePokemon(data);

    request.subscribe({
      next: () => {
        this.pokemonService.fetchPokemonList();
        this.cancelEdit();
      }
    });
  }

  editPokemon(pokemon: PokemonEntry) {
    this.editingPokemonId = pokemon._id;
    this.pokemonForm.setValue({
      name: pokemon.name,
      type: pokemon.type,
      level: pokemon.level,
      nature: pokemon.nature,
    });
  }

  cancelEdit() {
    this.editingPokemonId = null;
    this.pokemonForm.reset();
  }

  deletePokemon(pokemon: PokemonEntry) {
    this.pokemonService.deletePokemon(pokemon._id).subscribe({
      next: () => {
        if (this.editingPokemonId === pokemon._id) this.cancelEdit();
        this.pokemonService.fetchPokemonList();
      }
    });
  }
}
