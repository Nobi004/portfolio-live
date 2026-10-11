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
      <p>
        <strong>You: </strong>
        {message.text}
      </p>
    );
  }
  return (
    <div>
      <p>{message.text}</p>
      {message.sources && message.sources.length > 0 && (
        <ul aria-label="Sources">
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
