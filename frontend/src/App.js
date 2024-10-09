import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import QuizComponent from './QuizComponent';
import QuizCorrections from './QuizCorrections';
import AIGeneratedQuizComponent from './AIGeneratedQuizComponent';
import AIGeneratedQuizCorrections from './AIGeneratedQuizCorrections';

function App() {
  return (
    <BrowserRouter>
      <div className="header">
        <h1 className='h1-header'> Frello</h1>
      </div>
      <Routes>
        <Route path="/" element={
          <EnterPage />
        } />
        <Route path="/instructions" element={
          <InstructionsPage />
        } />
        <Route path="/quiz" element={
          <QuizComponent />
        } />
        <Route path="/ai-quiz" element={
          <AIGeneratedQuizComponent />
        } />
        <Route path="/ai-quiz-corrections" element={
          <AIGeneratedQuizCorrections />
        } />
        <Route path="/corrections" element={
          <QuizCorrections />
        } />
      </Routes>
    </BrowserRouter>
  );
}

function EnterPage() {
  return (
    <div className="enter-page">
      <h1>Grammatica Inglese Avanzata: Temi Verbali, Vocabolario e Pronuncia</h1>
      <h2>Revisione Grammaticale Approfondita (In-depth Grammar Review)</h2>
<p>I tempi verbali sono fondamentali nella grammatica inglese. Esaminiamo i principali tempi verbali con le loro sfumature:</p>
<ul>
  <li>
    <b>Past Simple (Passato Semplice)</b>: Utilizzato per descrivere azioni completate nel passato.
    <span>Esempio: "I went to the store" (Sono andato al negozio)</span>
    <span>Uso avanzato: Anche per abitudini passate o stati prolungati nel passato.</span>
    <span>Esempio: "I smoked for 10 years" (Ho fumato per 10 anni)</span>
  </li>
  <li>
    <b>Present Perfect (Presente Perfetto)</b>: Usato per collegare il passato al presente.
    <span>Esempio: "I have lived in London for five years" (Vivo a Londra da cinque anni)</span>
    <span>Confronto con l'italiano: Simile al passato prossimo, ma con usi più specifici in inglese.</span>
  </li>
  <li>
    <b>Past Perfect (Trapassato Prossimo)</b>: Per azioni completate prima di un altro evento passato.
    <span>Esempio: "I had finished my homework before dinner" (Avevo finito i compiti prima di cena)</span>
  </li>
  <li>
    <b>Present Continuous (Presente Progressivo)</b>: Per azioni in corso nel presente.
    <span>Esempio: "I am studying English" (Sto studiando inglese)</span>
    <span>Uso avanzato: Anche per arrangiamenti futuri.</span>
    <span>Esempio: "I'm meeting John tomorrow" (Incontro John domani)</span>
  </li>
  <li>
    <b>Future Perfect (Futuro Anteriore)</b>: Per azioni che saranno completate entro un momento specifico nel futuro.
    <span>Esempio: "By next year, I will have finished my degree" (Entro l'anno prossimo, avrò completato la mia laurea)</span>
  </li>
  <li>
    <b>Conditional Tenses (Condizionali)</b>: Per situazioni ipotetiche.
    <span>Esempio: "If I had more time, I would travel more" (Se avessi più tempo, viaggerei di più)</span>
    <span>Nota: In italiano, useremmo il congiuntivo nella frase ipotetica.</span>
  </li>
</ul>

<h2>Costruzione del Vocabolario (Vocabulary Building)</h2>
<p>Espandi il tuo vocabolario con queste espressioni essenziali:</p>
<ul>
  <li>
    <b>Idioms (Modi di Dire)</b>: Espressioni fisse con significati non letterali.
    <span>Esempio: "It's raining cats and dogs" (Sta piovendo a catinelle)</span>
    <span>Equivalente italiano: "Piove a dirotto"</span>
  </li>
  <li>
    <b>Phrasal Verbs (Verbi Frasali)</b>: Verbi combinati con preposizioni o avverbi.
    <span>Esempio: "Look after" (Prendersi cura di)</span>
    <span>Nota: Molto comuni in inglese, spesso non hanno un equivalente diretto in italiano.</span>
  </li>
  <li>
    <b>Collocations (Collocazioni)</b>: Parole che appaiono spesso insieme.
    <span>Esempio: "Heavy rain" (Pioggia forte), non "Strong rain"</span>
  </li>
  <li>
    <b>False Friends (Falsi Amici)</b>: Parole che sembrano simili in italiano e inglese ma hanno significati diversi.
    <span>Esempio: "Actually" (In realtà), non "Attualmente" (Currently)</span>
  </li>
</ul>

<h2>Consigli per la Comprensione della Lettura (Reading Comprehension Tips)</h2>
<p>Migliora la tua comprensione della lettura con queste strategie avanzate:</p>
<ul>
  <li>
    <b>Skimming and Scanning</b>: Tecniche di lettura rapida per individuare informazioni specifiche o l'idea generale.
  </li>
  <li>
    <b>Contextual Clues (Indizi Contestuali)</b>: Usa il contesto per dedurre il significato di parole sconosciute.
  </li>
  <li>
    <b>Critical Analysis (Analisi Critica)</b>: Valuta l'argomento, il tono e il punto di vista dell'autore.
  </li>
  <li>
    <b>Summarising (Riassumere)</b>: Pratica la sintesi dei punti principali di un testo in poche frasi.
  </li>
</ul>

<h2>Pronuncia e Accento Britannico (Pronunciation and British Accent)</h2>
<p>Alcuni punti chiave per migliorare la tua pronuncia britannica:</p>
<ul>
  <li>
    <b>Received Pronunciation (RP)</b>: L'accento "standard" britannico, spesso usato nei media.
  </li>
  <li>
    <b>Silent Letters (Lettere Mute)</b>: Molte parole inglesi hanno lettere che non si pronunciano.
    <span>Esempio: "Knight" (Cavaliere) - la 'k' e la 'gh' sono mute.</span>
  </li>
  <li>
    <b>Stress and Intonation (Accento e Intonazione)</b>: Cruciali per sembrare naturali in inglese.
    <span>Esempio: "photograph" (accento sulla prima sillaba) vs "photographer" (accento sulla seconda sillaba)</span>
  </li>
</ul>

<h2>Differenze tra Inglese Britannico e Americano</h2>
<p>Alcune differenze chiave da tenere a mente:</p>
<ul>
  <li>
    <b>Spelling</b>: 
    Britannico: colour, centre, realise
    <span>&emsp;&emsp;&emsp;&emsp;&emsp;&ensp;Americano: color, center, realize</span>
  </li>
  <li>
    <b>Vocabolario</b>:
    Britannico: lift, flat, biscuit
    <span>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&ensp;&ensp;Americano: elevator, apartment, cookie</span>
  </li>
  <li>
    <b>Grammatica</b>:
    Britannico: "I have got a car" (più comune)
    <span>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&ensp;Americano: "I have a car" (più comune)</span>
  </li>
</ul>
  
      <p className="enthusiasm">
        Congratulazioni per aver completato questa lezione avanzata di grammatica inglese! Ricorda, l'apprendimento di una lingua è un viaggio emozionante e gratificante. Ogni nuovo concetto che padroneggi ti avvicina sempre di più alla fluidità nella lingua inglese. Continua così, persevera nei tuoi studi e presto ti sorprenderai di quanto lontano sei arrivato. L'inglese apre porte a nuove opportunità, culture e amicizie in tutto il mondo. Embrace the challenge, enjoy the process, and keep up the fantastic work!
      </p>
      <button onClick={() => window.location.href = '/instructions'} className="enter-button">
        Continua
      </button>
    </div>
  );
}

function InstructionsPage() {
  return (
    <div className="instructions-page">
      <h1>Ciao! Fai il Quiz!</h1>
      <h3>Instructions</h3>
      <p>Read each question carefully and choose the correct answer.</p>
      <p>The quiz consists of 7 multiple-choice questions.</p>
      <p>Take a deep breath. Have fun!</p>
      <button onClick={() => window.location.href = '/quiz'} className="start-button">
        Start Quiz
      </button>
    </div>
  );
}

export default App;