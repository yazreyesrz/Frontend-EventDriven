import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import "./App.css";

interface FormData {
  name: string;
  price: string;
  amount: string;
}

const socket: Socket = io("http://44.214.240.239:4003");

function App() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    price: "",
    amount: "",
  });

  const [pedidos, setPedidos] = useState<any[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://44.214.240.239:4000/postre",
        formData
      );
      console.log("Post request successful:", response.data);
      // Add further logic or state updates as needed
    } catch (error) {
      console.error("Error making post request:", error);
      // Handle error, show user feedback, etc.
    }
  };

  useEffect(() => {
    // Listen for newPedido events from the server
    socket.on("newPedido", (data: any) => {
      // Update the state with the new pedido
      setPedidos((prevPedidos) => [...prevPedidos, data]);
    });

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off("newPedido");
    };
  }, []); // Run this effect only once on mount

  return (
    <div className="container">
      <h1>React + Vite Form</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </label>
        <label>
          Price:
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
        </label>
        <label>
          Amount:
          <input
            type="text"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Submit</button>
      </form>

      <h2>Received Pedidos:</h2>
      <ul>
        {pedidos.map((pedido, index) => (
          <li key={index}>{JSON.stringify(pedido)}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
