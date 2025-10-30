import Spline from '@splinetool/react-spline';

export default function HeroCover() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-b-3xl">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/D17NpA0ni2BTjUzp/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-neutral-950/90" />
    </div>
  );
}
