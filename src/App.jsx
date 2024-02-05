import { useEffect, useState } from 'react';
import './App.css';
import { getAllPokemon, getPokemon } from './utils/pokemon';
import Card from './components/Card/Card';
import Navbar from './components/Nanbar/Navbar';

function App() {

  const initailURL = "https://pokeapi.co/api/v2/pokemon";

  //データをロードしている時間の際にロードしている表記をする
  //useStateでローディングのフラグを管理
  const [loading, setLoading] = useState(true);

  const [pokemonData, setPokemonData] = useState([]);
  const [nextURL, setNextURL] = useState([]);
  const [prevURL, setPrevURL] = useState([]);

  useEffect(() => {
    const fetchPokemonData = async () => {
      //全てのポケモンデータを取得
      const res = await getAllPokemon(initailURL);

      //各ポケモンの詳細データ取得
      loadPokemon(res.results);
      console.log(res);
      // console.log(res.results);

      setNextURL(res.next);
      setPrevURL(res.previous);

      //ポケモンんデータを取得し終えたらローディングのフラグをfalseにする
      // console.log(res);
      setLoading(false);
    };
    fetchPokemonData();
  }, []);

  const loadPokemon = async (data) => {
    const _pokemonData = await Promise.all(
      data.map((pokemon) => {
        // console.log(pokemon);
        const pokemonRecord = getPokemon(pokemon.url);
        return pokemonRecord;
      })
    );
    setPokemonData(_pokemonData);
  };

  // console.log(pokemonData);

  const handleNextPage = async () => {
    setLoading(true);
    const data = await getAllPokemon(nextURL);
    await loadPokemon(data.results)
    setPrevURL(data.previous);
    setNextURL(data.next);
    setLoading(false);
  };

  const handlePrevPage = async () => {
    if (!prevURL) return;
    setLoading(true);
    const data = await getAllPokemon(prevURL);
    await loadPokemon(data.results);
    setNextURL(data.next);
    setPrevURL(data.previous);
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="App">
        {loading ? (
          <h1>ロード中・・・</h1>
        ) : (<>
          <div className="pokemonCardContainer">
            {pokemonData.map((pokemon, i) => {
              return <Card key={i} pokemon={pokemon} />;
            })}
          </div>
          <div className="btn">
            <button onClick={handlePrevPage}>前へ</button>
            <button onClick={handleNextPage}>次へ</button>
          </div>
        </>
        )}
      </div>
    </>
  );
}

export default App;
