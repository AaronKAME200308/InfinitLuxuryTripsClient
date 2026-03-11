// Pages placeholder — seront remplacées dans le Bloc 3
const placeholder = (name: string) => () => (
  <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond, serif' }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 13, letterSpacing: 4, color: '#C9A84C', textTransform: 'uppercase', marginBottom: 16 }}>Coming in Bloc 3</div>
      <h1 style={{ fontSize: 48, fontWeight: 300, color: '#1E1B6B' }}>{name}</h1>
    </div>
  </div>
);

export const Home             = placeholder('Home');
export const Destinations     = placeholder('Destinations');
export const DestinationDetail = placeholder('Destination Detail');
export const Reservation      = placeholder('Reservation');
export const Confirmation     = placeholder('Confirmation');
export const Blog             = placeholder('Blog');
export const Contact          = placeholder('Contact');
