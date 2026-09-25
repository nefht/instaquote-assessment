import { FileText, LoaderCircle, RotateCcw } from "lucide-react";
import { useState } from "react";
import { FileDropzone } from "./components/FileDropzone";
import { LineItemCard } from "./components/LineItemCard";
import { RefusalCard } from "./components/RefusalCard";
import { extractPdf } from "./services/extractionApi";
import type { ExtractionResult } from "./types/extraction";

type State =
  | { kind: "idle" }
  | { kind: "ready"; file: File }
  | { kind: "loading"; file: File }
  | { kind: "success"; result: ExtractionResult }
  | { kind: "error"; message: string };

export default function App() {
  const [state, setState] = useState<State>({ kind: "idle" });
  const reset = () => setState({ kind: "idle" });

  const run = async (file: File) => {
    setState({ kind: "loading", file });

    try {
      setState({ kind: "success", result: await extractPdf(file) });
    } catch (error) {
      setState({
        kind: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to process document.",
      });
    }
  };

  return (
    <main>
      <header>
        <div className="brand">
          <div className="logo">IQ</div>
          <span>Document Extractor</span>
        </div>
      </header>

      <section className="hero">
        <span className="eyebrow">TRACEABLE DOCUMENT INTELLIGENCE</span>
        <h1>
          Extract line items.
          <br />
          Keep the evidence.
        </h1>
        <p>
          Construction document extraction that refuses to guess when the source
          cannot support a value.
        </p>
      </section>

      <section className="workspace">
        {state.kind === "idle" && (
          <FileDropzone onFile={(file) => setState({ kind: "ready", file })} />
        )}

        {state.kind === "ready" && (
          <div className="selected">
            <FileText />
            <div>
              <b>{state.file.name}</b>
              <span>{(state.file.size / 1024).toFixed(1)} KB</span>
            </div>
            <button className="secondary" onClick={reset}>
              Remove
            </button>
            <button onClick={() => run(state.file)}>Extract document</button>
          </div>
        )}

        {state.kind === "loading" && (
          <div className="loading">
            <LoaderCircle className="spin" />
            <h2>Processing {state.file.name}</h2>
            <p>
              Reading pages, verifying evidence and checking extracted values…
            </p>
          </div>
        )}

        {state.kind === "error" && (
          <div className="error">
            <h2>Unable to process this document</h2>
            <p>{state.message}</p>
            <button onClick={reset}>
              <RotateCcw size={16} /> Try another PDF
            </button>
          </div>
        )}

        {state.kind === "success" && (
          <Results result={state.result} reset={reset} />
        )}
      </section>
    </main>
  );
}

function Results({
  result,
  reset,
}: {
  result: ExtractionResult;
  reset: () => void;
}) {
  return (
    <div className="results">
      <div className="result-head">
        <div>
          <span className="eyebrow">EXTRACTION COMPLETE</span>
          <h2>{result.document.fileName}</h2>
          <p>
            {result.document.pageCount} page
            {result.document.pageCount === 1 ? "" : "s"} processed
          </p>
        </div>
        <button className="secondary" onClick={reset}>
          <RotateCcw size={16} /> Upload another
        </button>
      </div>

      <div className="summary">
        <div>
          <b>{result.items.length}</b>
          <span>Extracted items</span>
        </div>
        <div>
          <b>{result.refusals.length}</b>
          <span>Needs review</span>
        </div>
      </div>

      {result.items.length > 0 && (
        <section className="section">
          <div className="section-title">
            <h2>Extracted items</h2>
            <span>Only values backed by source evidence</span>
          </div>
          {result.items.map((item, index) => (
            <LineItemCard key={index} item={item} />
          ))}
        </section>
      )}

      {result.refusals.length > 0 && (
        <section className="section">
          <div className="section-title">
            <h2>Needs review</h2>
            <span>Uncertain values were not guessed</span>
          </div>
          {result.refusals.map((item, index) => (
            <RefusalCard key={index} refusal={item} />
          ))}
        </section>
      )}
    </div>
  );
}
