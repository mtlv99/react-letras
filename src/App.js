import React, { useState, useEffect, Fragment } from "react";
import Formulario from "./components/Formulario";
import Axios from "axios";
import Cancion from "./components/Cancion";
import Info from "./components/Info";
import Spinner from "./components/Spinner";
import Error from "./components/Error";

function App() {
  // definir state

  const [busquedaLetra, setBusquedaLetra] = useState({});
  const [letra, setLetra] = useState("");
  const [artista, setArtista] = useState({});

  const [error, setError] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [cargando, setCargando] = useState(false);

  // TODO: que muestre un mensaje si en la API de letras se encontro una letra, pero en la otra
  // no se encuentre info del artista

  useEffect(() => {
    if (Object.keys(busquedaLetra).length === 0) return;

    const consultarAPILetra = async () => {
      try {
        const { artista, cancion } = busquedaLetra;

        const urlLyrics = `https://api.lyrics.ovh/v1/${artista}/${cancion}`;
        const urlArtista = `https://theaudiodb.com/api/v1/json/1/search.php?s=${artista}`;

        setCargando(true);

        const [letra, informacion] = await Promise.all([
          Axios(urlLyrics),
          Axios(urlArtista)
        ]);

        if (informacion.data.artists) {
          setLetra(letra.data.lyrics);
          setArtista(informacion.data.artists[0]);
          setError(false);
        } else {
          setError(true);
          setMensajeError("No se ha encontrado el artista. Intenta de nuevo.");
        }

        setCargando(false);
      } catch (err) {
        console.log(err.response);
        setError(true);
        setCargando(false);
        if (err.response.status === 404) {
          setMensajeError("No se ha encontrado la canción. Intenta de nuevo.");
        } else {
          setMensajeError(
            "Ha ocurrido un error desconocido. Intenta de nuevo."
          );
        }
      }
    };

    consultarAPILetra();
  }, [busquedaLetra]);
  return (
    <>
      <Formulario setBusquedaLetra={setBusquedaLetra} />

      <div className="container mt-5">
        <div className="row justify-content-center">
          {cargando ? (
            <Spinner />
          ) : (
            <Fragment>
              {error ? (
                <Error mensaje={mensajeError} />
              ) : (
                <>
                  <div className="col-md-6">
                    <Info artista={artista} />
                  </div>

                  <div className="col-md-6">
                    <Cancion letra={letra} />
                  </div>
                </>
              )}
            </Fragment>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
