import { useEffect, useState } from "react";

type Response<T> = [T[], boolean, (data: T, method: string) => void];

export function useFetch<T>(url: string): Response<T> {
  const [data, setData] = useState<T[]>([]);

  const [config, setConfig] = useState<RequestInit>({});
  const [method, setMethod] = useState("");
  const [callFetch, setCallFetch] = useState<T | false>(false);
  const [loading, setLoading] = useState(false);

  const httpConfig = (data: T, method: string) => {
    if (method === "POST") {
      setConfig({
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      setMethod(method);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const response = await fetch(url);
        const data = (await response.json()) as T[];

        setData(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    })();
  }, [url, callFetch]);

  useEffect(() => {
    (async () => {
      if (method === "POST") {
        try {
          const response = await fetch(url, config);
          const newProduct = (await response.json()) as T;

          setCallFetch(newProduct);
        } catch (err) {
          console.log(err);
        }
      }
    })();
  }, [config, method, url]);

  return [data, loading, httpConfig];
}
