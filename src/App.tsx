import { FormEvent, useState } from "react";

import { useFetch } from "hooks/useFetch";

interface Product {
  id: number;
  name: string;
  price: number;
}
const url = "http://localhost:8080/products";

const App = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const [products, loading, httpConfig] = useFetch<Product>(url);

  const initialValueOfInputs = () => {
    setName("");
    setPrice("");
  };

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    try {
      const product = {
        id: Number(new Date().getTime()),
        name,
        price: Number(price),
      };

      httpConfig(product, "POST");
      initialValueOfInputs();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Produto:
          <input
            type="text"
            value={name}
            name="name"
            disabled={loading}
            onChange={(evt) => setName(evt.target.value)}
          />
        </label>

        <label>
          Preço:
          <input
            type="number"
            step="any"
            value={price}
            name="price"
            disabled={loading}
            onChange={(evt) => setPrice(evt.target.value)}
          />
        </label>

        {loading ? (
          <button type="submit" disabled>
            Cadastrando...
          </button>
        ) : (
          <button type="submit">Cadastrar Produto</button>
        )}
      </form>

      <h1>Lista de produtos</h1>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <ul>
          {!!products &&
            products.map((product) => (
              <li key={product.id}>
                <strong>{product.name}</strong>
                {` - `}
                {product.price.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default App;
