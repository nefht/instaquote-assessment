import { FileUp } from "lucide-react";

export function FileDropzone({ onFile }: { onFile: (file: File) => void }) {
  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();

    const file = event.dataTransfer.files?.[0];

    if (file) {
      onFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  return (
    <label className="drop" onDragOver={handleDragOver} onDrop={handleDrop}>
      <FileUp size={32} />
      <strong>Drop a PDF document here</strong>
      <span>or click to browse files · PDF</span>

      <input
        type="file"
        accept="application/pdf,.pdf"
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (file) {
            onFile(file);
          }
        }}
      />
    </label>
  );
}
