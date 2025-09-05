import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://cashapp.otabekshoyimov.com"],
  })
);

app.get("/", (req, res) => res.send("Hello World"));

type RateResponse = {
  amount: number;
  base: string;
  rates: Record<string, number>;
};

app.get("/rates", async (req, res) => {
  const BASE_URL = "https://api.unirateapi.com/api";

  try {
    const rates = await fetch(
      `${BASE_URL}/rates?api_key=${process.env.UNIRATE_API_KEY}`
    );
    const data: RateResponse = await rates.json();
    const filtered = {
      amount: data.amount,
      base: data.base,
      rates: {
        EUR: data.rates.EUR,
        USD: data.rates.USD,
      },
    };

    res.json(filtered);
  } catch (error) {
    console.error("err during fetch", error);
    res.status(500).json({ error: "failted to fetch rates" });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
