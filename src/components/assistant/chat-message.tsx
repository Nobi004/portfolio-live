import Link from "next/link";

export interface Source {
  title: string;
  route: string;
}

export interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
  sources?: Source[];
}

export function ChatMessage({ message }: { message: Message }) {
  if (message.role === "user") {
    return (
      <p className="ask-message-user">
        <strong>You: </strong>
        {message.text}
      </p>
    );
  }
  return (
    <div className="ask-message-assistant">
      <p>{message.text}</p>
      {message.sources && message.sources.length > 0 && (
        <ul className="ask-sources" aria-label="Sources">
          {message.sources.map((s) => (
            <li key={s.route}>
              <Link href={s.route}>{s.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
