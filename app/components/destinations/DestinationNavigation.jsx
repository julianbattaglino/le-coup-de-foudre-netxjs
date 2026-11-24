const navigationItems = [
  { id: "overview", label: "Overview" },
  { id: "journey", label: "The journey" },
  { id: "day-1", label: "Day by day" },
  { id: "stay", label: "Your stay" },
];

export default function DestinationNavigation({ items = navigationItems }) {
  return (
    <nav className="destination-navigation" aria-label="Journey sections">
      {items.map((item) => (
        <a key={item.id} href={`#${item.id}`}>{item.label}</a>
      ))}
    </nav>
  );
}
