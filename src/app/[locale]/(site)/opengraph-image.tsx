import { ImageResponse } from 'next/og';

// Generated once at build time as a PNG, the format link previews accept.
export const alt = 'CityQuest – Every City Has a Secret. Discover It.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 90px',
          background: 'linear-gradient(180deg, #060B16 0%, #0B1324 60%, #1C2E4A 100%)',
          color: '#F8F4EC',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: 120,
            top: 60,
            width: 220,
            height: 220,
            borderRadius: 9999,
            background: 'radial-gradient(circle, #F6E6C2 0%, #F6E6C2 22%, rgba(221,182,106,.45) 40%, rgba(221,182,106,0) 70%)',
          }}
        />
        <div style={{ display: 'flex', fontSize: 104, fontWeight: 700, letterSpacing: -2 }}>
          City<span style={{ color: '#DDB66A' }}>Quest</span>
        </div>
        <div style={{ display: 'flex', marginTop: 16, fontSize: 44, color: '#DDB66A' }}>Every City Has a Secret. Discover It.</div>
        <div style={{ display: 'flex', marginTop: 28, fontSize: 30, color: '#C9C3B8' }}>Outdoor mysteries · Heidelberg</div>
      </div>
    ),
    size,
  );
}
