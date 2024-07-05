"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { ReadableStreamDefaultReader } from "stream/web";
import { Frame } from "@gptscript-ai/gptscript";
import renderEventMessage from "@/lib/renderEventMessage";

const storiesPath = "public/stories";

function StoryWriter() {
  const [story, setStory] = useState<string>("");
  const [pages, setPages] = useState<number>();
  const [progress, setProgress] = useState("");
  const [runStarted, setRunStarted] = useState<boolean>(false);
  const [runFinished, setRunFinished] = useState<boolean | null>(null);
  const [currentTool, setCurrentTool] = useState("");
  const [events, setEvents] = useState<Frame[]>([]);

  const runScript = async () => {
    setRunStarted(true);
    setRunFinished(false);

    const response = await fetch("/api/run-script", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ story, pages, path: storiesPath }),
    });

    if (response.ok && response.body) {
      console.log("Streaming has started.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      //@ts-ignore
      handleStream(reader, decoder);
    } else {
      setRunFinished(true);
      setRunStarted(false);
      console.error("Failed to start streaming.");
    }
  };

  const handleStream = async (
    reader: ReadableStreamDefaultReader<Uint8Array>,
    decoder: TextDecoder
  ) => {
    // Manage the stream from the API
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // The decoder is used to decode the Uint8Array into a string.
      const chunk = decoder.decode(value, { stream: true });

      // We split the chunks into events by splitting it by the event: keyword.
      const eventsData = chunk
        .split("\n\n")
        .filter((line) => line.startsWith("event"))
        .map((line) => line.replace(/^event: /, ""));

      // We parse the JSON data and update the state accordingly.
      eventsData.forEach((data) => {
        try {
          const parsedData = JSON.parse(data);
          if (parsedData.type === "callProgress") {
            setProgress(
              parsedData.output[parsedData.output.length - 1].content
            );
            setCurrentTool(parsedData.tool?.description || "");
          } else if (parsedData.type === "callStart") {
            setCurrentTool(parsedData.tool?.description || "");
          } else if (parsedData.type === "runFinished") {
            setRunFinished(true);
            setRunStarted(false);
          } else {
            setEvents((prevEvents) => [...prevEvents, parsedData]);
          }
        } catch (error) {
          console.error("Failed to parse the JSON", error);
        }
      });
    }
  };

  return (
    <div className="flex flex-col container">
      <section className="flex-1 flex flex-col border border-orange-300 rounded-md p-10 space-y-2">
        <Textarea
          value={story}
          onChange={(e) => setStory(e.target.value)}
          className="flex-1 text-black"
          placeholder="Escribí una historia acerca de un chico que le gusta cocinar..."
        />
        <Select onValueChange={(value) => setPages(parseInt(value))}>
          <SelectTrigger>
            <SelectValue placeholder="¿Cuántas páginas tiene que tener la historia?" />
          </SelectTrigger>
          <SelectContent className="w-full">
            {Array.from({ length: 10 }, (_, i) => (
              <SelectItem value={String(i + 1)} key={i}>
                {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          disabled={!story || !pages || runStarted}
          className="w-full"
          size="lg"
          onClick={runScript}
        >
          Generar Historia
        </Button>
      </section>

      <section className="flex-1 pb-5 mt-5">
        <div className="flex flex-col-reverse w-full space-y-2 bg-gray-800 rounded-md text-gray-200 font-mono p-10 h-96 overflow-y-scroll">
          <div>
            {runFinished === null && (
              <>
                <p className="animate-pulse mr-5">
                  Te estoy esperando para generar una historia...
                </p>
                <br />
              </>
            )}
            <span className="mr-5">{">>"}</span>
            {progress}
          </div>

          {currentTool && (
            <div className="py-10">
              <span className="mr-5">{"--- [Current Tool] ---"}</span>

              {currentTool}
            </div>
          )}

          <div className="space-y-5">
            {events.map((event, index) => (
              <div key={index}>
                <span className="mr-5">{">>"}</span>
                {renderEventMessage(event)}
              </div>
            ))}
          </div>

          {runStarted && (
            <div>
              <span className="mr-5 animate-in"></span>
              <br />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default StoryWriter;
