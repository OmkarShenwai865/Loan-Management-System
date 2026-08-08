const PALETTE = [
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-teal-100 text-teal-700",
  "bg-orange-100 text-orange-700",
  "bg-pink-100 text-pink-700",
  "bg-indigo-100 text-indigo-700",
];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function initialsOf(name) {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Avatar({ name, size = "w-9 h-9" }) {
  const colorClass = PALETTE[hashString(name || "?") % PALETTE.length];

  return (
    <div
      className={`${size} rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${colorClass}`}
    >
      {initialsOf(name)}
    </div>
  );
}
