import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Translate() {
  const [inputText, setInputText] = useState("");
  const [resultText, setResultText] = useState("");
  const [selectedLanguageKey, setLanguageKey] = useState("");
  const [languagesList, setLanguagesList] = useState([]);
  const [detectLanguageKey, setdetectedLanguageKey] = useState("");

  const getLanguageSource = () => {
    axios
      .post(`https://libretranslate.de/detect`, {
        q: inputText,
      })
      .then((response) => {
        setdetectedLanguageKey(response.data[0].language);
      });
  };

  const translateText = async(e) => {
    e.preventDefault();
    setResultText(inputText);
    getLanguageSource();

    let data = {
      q: inputText,
      source: detectLanguageKey,
      target: selectedLanguageKey,
    };
    axios.post(`https://libretranslate.de/translate`, data).then((response) => {
      setResultText(response.data.translatedText);
    });
  };

  
  const languageKey = (selectedLanguage) => {
    setLanguageKey(selectedLanguage.target.value);
  };

  useEffect(() => {
    axios.get(`https://libretranslate.de/languages`).then((response) => {
      setLanguagesList(response.data);
    });
    getLanguageSource();
    // eslint-disable-next-line
  }, [inputText]);

  return (
    <div className="main">
      <form className="form">
        <h1>Translate Your Wishes Here!!</h1>
        <input
          required
          type="text"
          placeholder="Type Text to Translate.."
          onChange={(e) => setInputText(e.target.value)}
        ></input>
        <select className="language-select" onChange={languageKey}>
          <option>Please Select Language..</option>
          {languagesList.map((language) => {
            return <option value={language.code}>{language.name}</option>;
          })}
        </select>
        <input
          required
          type="text"
          placeholder="tranlation will appear here"
          value={resultText}
        ></input>
        <button className="submit__btn" type="submit" onClick={translateText}>
          Submit
        </button>
      </form>
    </div>
  );
}
