type Props = { address: string };

export function MapEmbed({ address }: Props) {
  const url = `https://www.google.com/maps/embed/v1/search?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&q=${encodeURIComponent(
    address
  )}`;

  return (
    <iframe
      width="100%"
      height="250"
      loading="lazy"
      style={{ border: 0 }}
      referrerPolicy="no-referrer-when-downgrade"
      src={url}
    />
  );
}
