const navigationItems = [
  { id: "presentation", label: "Presentation" },
  { id: "stay", label: "Our Stay" },
  { id: "tours", label: "Tours" },
  { id: "experiences", label: "Experiences" },
];

export default function DestinationNavigation() {
  return (
    <nav className="destination-navigation" aria-label="Destination sections">
      {navigationItems.map((item) => (
        <a key={item.id} href={`#${item.id}`}>
          {item.label}
        </a>
      ))}
    </nav>
  );
}
